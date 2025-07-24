const DMX = require('dmx')

const dmx = new DMX()
const driver = 'enttec-open-usb-dmx' // to display raw dmx data, set 'null'
const deviceId = '/dev/tty.usbserial-A50285BI' // specify your usb-dmx device name
const universe = dmx.addUniverse( 'demo', driver, deviceId )

let flag = true;

// In this example,
// start address of first dmx light is `1`, while other is `10`
//
// === DMX MAP of devices ===
//  1 : Tilt (Maximum 540 deg.)
//  2 : Pan  (Maximum 180 deg.)
//  3 : Dimmer
//  4 : RED
//  5 : GREEN
//  6 : BLUE
//  7 : WHITE

setInterval(() => {
  if(flag){
    // sa: 1,   red - rgb( 255, 0, 0 )
    universe.update({  1: 160,  2: 160,  3: 255,  4: 255, 5: 0 });
    // sa: 10, blue - rgb( 0, 0, 255 )
    universe.update({ 10:  32, 11: 160, 12: 255, 13:   0, 14: 0, 15: 255 });
  }else{
    // sa: 1,   green - rgb( 0, 255, 0 )
    universe.update({ 1: 32, 2: 96, 3: 255, 4: 0, 5: 255});
    // sa: 10, yellow - rgb( 255, 255, 0 )
    universe.update({ 10: 160, 11: 96, 12: 255, 13: 255, 14: 255, 15: 0});
  }
  flag = !flag
}, 2_500);

