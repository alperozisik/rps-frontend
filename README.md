# RPS Frontend

This repository is the frontend of the RPS (Rock Paper Scissors) game created by Alper Ozisik.

# Running
In order to run the frontend, a running public [backend](https://github.com/alperozisik/rps-backend) is needed to communicate.
The url to the backend is given within the code. Please modify [common.js](./src/services/common.js) file and build.

[dist/index.html](./dist/index.html) is the main entry.

# Install
After cloning the repository run the following commands
```shell
npm i
npm run build
```

# Distribute
The content of the frontend is just an html file, single bundle JavaScript file and png images. There is no need for a server to host the frontend. This gives the oppurtunity to run it locally or host it on the CDN.

# Browser support
This game is using ES6, HTML5 and CCS3 heavly. Please use a browser which is not older a year.

Tested on the following browsers:
- Chrome 67 (Windows, macOS, Android)
- Firefox 60 (Windows, macOS)
- Microsoft Edge 42
- Opera 53 (Windows, macOS)
- Safari 11 (macOS, iOS)

Internet Explorer is not supported. If the page is being opened on Internet Explorer it is showing that the browser is incompatible .

## Responsive design
Most of the responsive behaviour is managed by the flex layout.
