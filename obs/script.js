// startWebsocket();
// function startWebsocket() {

//     // change this to the IP of where the GUI is being used for remote control
//     const webSocket = new WebSocket("ws://localhost:8081");
//     webSocket.onopen = () => { // if it connects successfully

//         // console.log("worked");
//         // everything will update everytime we get data from the server (the GUI)
//         webSocket.onmessage = function (event) {
//             console.log(event.data);
//             updateData(JSON.parse(event.data))
//         }

//     }

//     // if the GUI closes, wait for it to reopen
//     webSocket.onclose = () => {errorWebsocket() }
//     // if connection fails for any reason
//     webSocket.onerror = () => {errorWebsocket() }

// }
// function errorWebsocket() {

//     // show error message
//     // document.getElementById('connErrorDiv').style.display = 'flex';
//     // console.log("broke");
//     // we will attempt to reconect every 1 second
//     setTimeout(() => {
//         startWebsocket();
//     }, 1000);

// }

var paused = false;

var started = false;

var $ = require("jquery");

ReconnectingWebSocket = require("reconnecting-websocket");

const rws = new ReconnectingWebSocket("ws://localhost:8081");

rws.addEventListener("message", (event) => {
  console.log(event.data);
  json_data = JSON.parse(event.data);
  if (json_data.data) {
    updateData(json_data.data);
  }

  if (json_data.timer) {
    if (json_data.action == "play") {
      if (started == false) {
        startTimer(json_data.timer * 60, document.querySelector("#timer"));
      }
      if (started == true) {
        paused = false;
      }
    }

    if (json_data.action == "pause") {
      if (started == true) {
        paused = true;
      }
    }

    if (json_data.action == "replay") {
      if (started == true) {
        timer = json_data.timer * 60;

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        // minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector("#timer").textContent = minutes + ":" + seconds;
      }
    }
  }
});

var current = "name";

var timerset = false;

var gt = makeGlobalTimer(15000);

function makeGlobalTimer(freq) {
  freq = freq || 1000;

  // array of callback functions
  var callbacks = [];

  // register the global timer
  var id = setInterval(function () {
    var idx;
    for (idx in callbacks) {
      callbacks[idx]();
    }
  }, freq);

  // return a Global Timer object
  return {
    id: function () {
      return id;
    },
    registerCallback: function (cb) {
      callbacks.push(cb);
    },
    cancel: function () {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    },
  };
}

function fade() {
  if (current == "name") {
    setInterval(() => {
      $("#twitter").fadeIn();
      $("#sponsor").fadeOut();
      $("#tag").fadeOut();
      current = "twitter";
      fade();
    }, 1000);
  } else {
    setInterval(() => {
      $("#twitter").fadeOut();
      $("#sponsor").fadeIn();
      $("#tag").fadeIn();
      current = "name";
      fade();
    }, 1000);
  }
}

function updateData(data) {
  // console.log(data);
  var player1 = document.querySelector(".player1");
  var player2 = document.querySelector(".player2");
  var comm1 = document.querySelector(".comm1");
  var comm2 = document.querySelector(".comm2");
  var upnext1 = document.querySelector(".upnext1");
  var upnext2 = document.querySelector(".upnext2");
  var score1 = document.querySelector(".score1");
  var score2 = document.querySelector(".score2");
  var round = document.querySelector(".round");
  var pronouns1 = document.querySelector(".pronouns1");
  var pronouns2 = document.querySelector(".pronouns2");

  if (player1) {
    player1.children[0].innerText = data["player"][0]["sponsor"];
    player1.children[1].innerText = data["player"][0]["tag"];
  }

  if (player2) {
    player2.children[0].innerText = data["player"][1]["sponsor"];
    player2.children[1].innerText = data["player"][1]["tag"];
  }

  if (comm1) {
    comm1.children[0].children[0].innerText = data["comm"][0]["sponsor"];
    comm1.children[0].children[1].innerText = data["comm"][0]["tag"];
    comm1.children[1].innerText = "@" + data["comm"][0]["twitter"];
    if (timerset == false) {
      gt.registerCallback(function () {
        if (current == "name") {
          $("#twitter").fadeIn();
          // $("#sponsor").fadeOut()
          // $("#tag").fadeOut()
          $("#name").fadeOut();
          current = "twitter";
        } else {
          $("#twitter").fadeOut();
          // $("#sponsor").fadeIn()
          // $("#tag").fadeIn()
          $("#name").fadeIn();
          current = "name";
        }
      });
      timerset = true;
    }
  }
  if (comm2) {
    comm2.children[0].children[0].innerText = data["comm"][1]["sponsor"];
    comm2.children[0].children[1].innerText = data["comm"][1]["tag"];

    comm2.children[1].innerText = "@" + data["comm"][1]["twitter"];

    if (timerset == false) {
      gt.registerCallback(function () {
        if (current == "name") {
          $("#twitter").fadeIn();
          // $("#sponsor").fadeOut()
          // $("#tag").fadeOut()
          $("#name").fadeOut();
          current = "twitter";
        } else {
          $("#twitter").fadeOut();
          // $("#sponsor").fadeIn()
          // $("#tag").fadeIn()
          $("#name").fadeIn();
          current = "name";
        }
      });
      timerset = true;
    }
    // fade()
  }
  if (upnext1) {
    upnext1.children[0].innerText = data["upnext"][0]["sponsor"];
    upnext1.children[1].innerText = data["upnext"][0]["tag"];
  }
  if (upnext2) {
    upnext2.children[0].innerText = data["upnext"][1]["sponsor"];
    upnext2.children[1].innerText = data["upnext"][1]["tag"];
  }
  if (score1) {
    score1.children[0].innerText = data["player"][0]["score"].filter(
      (value) => value === true
    ).length;
  }
  if (score2) {
    score2.children[0].innerText = data["player"][1]["score"].filter(
      (value) => value === true
    ).length;
  }
  if (round) {
    round.children[0].innerText = data["round"];
  }
  if (pronouns1) {
    pronouns1.children[0].innerText = data["player"][0]["pronouns"];
  }
  if (pronouns2) {
    pronouns2.children[0].innerText = data["player"][1]["pronouns"];
  }
}

var timer;

function startTimer(duration, display) {
  timer = duration;
  started = true;
  var interval = setInterval(function () {
    if (paused == false) {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      // minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        // timer = duration;
        clearInterval(interval);
        started = false;
      }
    }
  }, 1000);
}
