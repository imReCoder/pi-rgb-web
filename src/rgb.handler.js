

const Gpio = require('pigpio').Gpio;

let ledRed = new Gpio(21, { mode: Gpio.OUTPUT }),
    ledGreen = new Gpio(20, { mode: Gpio.OUTPUT }),
    ledBlue = new Gpio(16, { mode: Gpio.OUTPUT }),
redRGB = 255,
greenRGB = 255, 
blueRGB = 255;

//RESET RGB LED
ledRed.digitalWrite(1); // Turn RED LED off
ledGreen.digitalWrite(1); // Turn GREEN LED off
ledBlue.digitalWrite(1); // Turn BLUE LED off

const handleNewValues = async(data)=>{
    //for common anode RGB LED  255 is fully off, and 0 is fully on, so we have to change the value from the client
    redRGB=255-parseInt(data.red);
    greenRGB=255-parseInt(data.green);
    blueRGB=255-parseInt(data.blue);

    console.log("rbg: " + redRGB + ", " + greenRGB + ", " + blueRGB); //output converted to console

    ledRed.pwmWrite(redRGB); //set RED LED to specified value
    ledGreen.pwmWrite(greenRGB); //set GREEN LED to specified value
    ledBlue.pwmWrite(blueRGB); //set BLUE LED to specified value
}

module.exports = {handleNewValues};