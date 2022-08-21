![screenshot2](https://user-images.githubusercontent.com/76669473/185814099-1953ad6d-06d6-43cd-9a89-5c1f9de04f2b.png)

A minimalist Electron app for managing stream overlays for Rivals of Aether, built with this template https://github.com/Deluze/electron-vue-template

## About

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

npm run build 

(to build `obs` files):

browserify .\script.js bundle.js

# OR

npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:linux # uses linux as build target
