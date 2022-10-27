![image](https://user-images.githubusercontent.com/76669473/198209431-9a92774e-302c-48bf-93a3-fa2815821aef.png)

A minimalist Electron app for managing stream overlays for Rivals of Aether, built with this template https://github.com/Deluze/electron-vue-template

This project is meant for users to style their own overlays, if you want something more "batteries included" then check out https://github.com/Readek/RoA-Stream-Tool
## Usage

Add the html files in the `obs` folder as sources in OBS, and the Electron app will connect to it with a websocket and automatically update.

## Getting started


### Install dependencies ⏬

```bash
npm install
```

### Start developing ⚒️

```bash
npm run dev
```

## Build

```bash
npm run build 
```

(to build obs files):

```bash
browserify .\script.js bundle.js
```

# OR

```bash
npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:linux # uses linux as build target
```
