

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


const writeValues = (r, g, b) => {
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    console.log(`Writing values : R: ${r} G: ${g} B:${b}`);
    ledRed.pwmWrite(r); //set RED LED to specified value
    ledGreen.pwmWrite(g); //set GREEN LED to specified value
    ledBlue.pwmWrite(b); //set BLUE LED to specified value
}



let lastMode;
let isFadeMode = false;
let fadeDelay = 33;

let modeBreak = false;
const handleNewValues = async (data) => {
    isFadeMode = false;
    //for common anode RGB LED  255 is fully off, and 0 is fully on, so we have to change the value from the client
    redRGB = parseInt(data.red);
    greenRGB = parseInt(data.green);
    blueRGB = parseInt(data.blue);
    writeValues(redRGB, greenRGB, blueRGB);
    modeBreak = false;

}

const delay = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

const stopModes = () => {
    isFadeMode = false;
}

const MODES = {
    fade: async () => {

        let rVal = 254;
        let gVal = 1;
        let bVal = 127;

        let rDir = -1;
        let gDir = 1;
        let bDir = -1;
        while (true) {
            if (!isFadeMode) return;
            writeValues(rVal, gVal, bVal);

            // change the values of the LEDs
            rVal = rVal + rDir;
            gVal = gVal + gDir;
            bVal = bVal + bDir;

            // for each color, change direction if
            // you reached 0 or 255
            if (rVal >= 255 || rVal <= 0) {
                rDir = rDir * -1;
            }

            if (gVal >= 255 || gVal <= 0) {
                gDir = gDir * -1;
            }

            if (bVal >= 255 || bVal <= 0) {
                bDir = bDir * -1;
            }

            // slight delay so it doesn't rotate color too quicky
            await delay(fadeDelay);
        }
    }
}



const changeMode = async (modeName, settings) => {
    stopModes();
    lastMode = modeName;
    const mode = MODES[modeName];
    switch (modeName) {
        case 'fade':
            fadeDelay = settings?.delay || 33;
            isFadeMode = true;
    }

}

const initializeModes = () => {
    for (let mode in MODES) {
        mode();
    }

}


initializeModes();

module.exports = { handleNewValues, changeMode };