const gpio = require('rpi-gpio');
const fs = require('fs');

const WATER_PIN = 37;

function getTime() {
  const date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function beginWater() {
  console.log(`${getTime()} - Beginning water`);
  gpio.write(WATER_PIN, true, err => {
    if (!err) {
      console.log(`${getTime()} - Water is on...`);
      setTimeout(endWater, 15000);
    } else {
      console.log(`${getTime()} - There was an error turning the water on: ${err}. Trying again in one minute...`);
      setTimeout(beginWater, 60000);
    }
  });
}

function endWater() {
  console.log(`${getTime()} - Watering complete. Shutting off...`);
  gpio.write(WATER_PIN, false, err => {
    if (!err) {
      console.log(`${getTime()} - Water is off. Shutting down.`);
      gpio.destroy(() => {
        console.log(`${getTime()} - Shutdown complete!`);
        process.exit();
      });
    } else {
      console.log(`${getTime()} - There was an error shutting the water off: ${err}.`);
    }
  });
}

gpio.setup(WATER_PIN, gpio.DIR_OUT, beginWater);

process.on('close', () => {
  gpio.write(WATER_PIN, false);
});
