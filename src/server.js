require('dotenv').config("../.env");


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,
  {cors: {
    origin: "*",
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

io.on('connection', (socket) => {
  console.log('A client Connected');
  socket.on("rgbChange",(newValues)=>{
    console.log(`Received new RGB values : `,JSON.stringify(newValues));
    if(process.env.NODE_ENV !== 'dev'){
      require("./rgb.handler.js").handleNewValues(newValues);
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