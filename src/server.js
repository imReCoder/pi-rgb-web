require('dotenv').config("../.env");


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,
  {cors: {
    origin: "https://unworshipped-beetle-4209.dataplicity.io",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
},
allowEIO3: true});


const routes= require('./routes.js');
app.use('/rgb', routes);
app.use("/",(req,res)=>{
  res.send(`Not found on RGB server ${req.url}`);
})

const env = process.env.NODE_ENV;
io.on('connection', (socket) => {
  let rgbHandler;
  if (env !== 'dev') {
    rgbHandler = require('./rgb.handler.js');
  }
  console.log('A client Connected');
  socket.on("rgbChange",(newValues)=>{
    console.log(`Received new RGB values : `,JSON.stringify(newValues));
    if (env !== 'dev') {
      rgbHandler.handleNewValues(newValues);
    }
  })
  socket.on(('modeChange'), ({ modeName, settings }) => {
    console.log(`Received mode change : ${modeName}`, settings);
    if (env !== 'dev') {
      rgbHandler.changeMode(modeName, settings);
    }
  })
});


const PORT = process.env.PORT || 3300;
server.listen(3300, () => {
  console.log(`listening on *:${PORT}`);
});

process.on('SIGINT', function () { //on ctrl+c
  ledRed.digitalWrite(1); // Turn RED LED off
  ledGreen.digitalWrite(1); // Turn GREEN LED off
  ledBlue.digitalWrite(1); // Turn BLUE LED off
  process.exit(); //exit completely
});