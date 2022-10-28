# Toast 🍞

No-hassle OBS tournament stream overlay manager

<img width="500" src="https://user-images.githubusercontent.com/76669473/198542237-d500020f-31d7-4080-a83e-ca995fb3b238.png"/>
<div>
<img width="500" src="https://user-images.githubusercontent.com/76669473/198543315-90d81d34-6d4e-454e-88cc-8444b7102c59.png"/>
<img width="500" src="https://user-images.githubusercontent.com/76669473/198543551-3fa33029-3db0-46bb-b7ff-e7efa496d52a.png"/>
</div>
<br/>

This project is meant for users to style their own overlays, if you want something more "batteries included" then check out https://github.com/Readek/RoA-Stream-Tool


Built with this Electron template: https://github.com/Deluze/electron-vue-template
## Usage

Add the html files in the `obs` folder as sources in OBS, and the app will connect to it with a websocket and automatically update.

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
npm run build:win
npm run build:mac
npm run build:linux
```
