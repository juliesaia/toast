import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";

import WebSocket from "ws";

// start a web socket server on boot
const server = new WebSocket.Server({ port: 8081 });
let sockets: WebSocket[] = [];
let data_global = JSON.stringify({
    player: [
        {
            sponsor: "SNT",
            tag: "CheesyPotato",
            score: 1,
        },
        {
            sponsor: "AZ",
            tag: "Plastic Dinos",
            score: 1,
        },
    ],
    comm: [
        {
            sponsor: "Daniel Fornaniel",
            tag: "GPik",
            twitter: "GPik",
        },
        {
            sponsor: "Daniel Fornaniel",
            tag: "Brosa",
            twitter: "Brosa",
        },
    ],
    upnext: [
        {
            sponsor: "PINK",
            tag: "Darai",
        },
        {
            sponsor: "AZ",
            tag: "SBS",
        },
    ],
    round: "Winner's Finals",
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 852,
        height: 664,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            spellcheck: false,
        },
        resizable: true,
        title: "Rivals Stream App",
        center: true,
        // titleBarStyle: 'hidden',
        // titleBarOverlay: {
        // color: '#8ccfec',
        // }
    });

    mainWindow.removeMenu();

    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.key === "F5") {
            // refresh the page
            mainWindow.reload();
            event.preventDefault();
        } else if (input.key === "F12") {
            // web console
            mainWindow.webContents.openDevTools();
            mainWindow.setResizable(true);
            event.preventDefault();
        }
    });

    if (process.env.NODE_ENV === "development") {
        const rendererPort = process.argv[2];

        mainWindow.loadURL(`http://localhost:${rendererPort}`);
    } else {
        mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
    }

    server.on("connection", (socket) => {
        // add this new connection to the array to keep track of them
        sockets.push(socket);

        // when a new client connects, send current data
        // mainWindow.webContents.send('requestData')
        socket.send(data_global);

        // when a socket closes, or disconnects, remove it from the array.
        socket.on("close", function () {
            sockets = sockets.filter((s) => s !== socket);
        });
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on("data", (event, data) => {
    data_global = data;
    sockets.forEach((socket) => {
        socket.send(JSON.stringify({ data: JSON.parse(data) }));
    });
});

ipcMain.on("timer", (event, data) => {
    // data_global = data
    sockets.forEach((socket) => {
        socket.send(JSON.stringify(data));
    });
});
