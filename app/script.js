/**
 * Draws a light element with specified pan, tilt, dimmer, and color.
 * 
 * @param {object} param0 
 * @param {string} param0.lightId - ID of the light element to draw
 * @param {number} param0.pan - Pan angle in degrees
 * @param {number} param0.tilt - Tilt angle in degrees
 * @param {number} param0.dimmer - Dimmer value (0-255)
 * @param {string} param0.color - Color in RGB format (e.g., "rgb(255, 0, 0)")
 * @param {string} [param0.text] - Optional text to display on the light element
 */
const drawLight = ( { lightId, pan, tilt, dimmer, color, text } ) => {
    const lightElement = document.querySelector(`#${lightId} .light`);
    const textElement = document.querySelector(`#${lightId} .text pre`);

    if( lightElement ) {
        lightElement.style.transition = 'transform 1s';
        lightElement.style.transform = `rotateX(${tilt}deg) rotateZ(${pan}deg)`;
        lightElement.style.filter = `brightness(${dimmer / 255})`;
        lightElement.style.backgroundColor = color;

        textElement.textContent = text || '';
    }
}

/**
 * Initialize the light element with default values.
 * 
 * @param {string} lightId - ID of the light element to initialize
 */
const initLight = ( lightId ) => {
    drawLight({ lightId, pan: 0, tilt: 0, dimmer: 0, color: 'rgb(0, 0, 0)' });
}

/**
 * Initialize the application by setting up event listeners for track elements, DataCue.
 */
function init() {
    const trackElements = document.querySelectorAll('track[kind="metadata"]'); 

    for( const trackElement of trackElements ) {
        const forValue = trackElement.getAttribute('for');

        if( forValue && trackElement.track ) {
            trackElement.addEventListener('cuechange', () => {
                const activeCues = trackElement.track.activeCues;
                if( activeCues && activeCues.length > 0 ) {
                    const currentCue = activeCues[0]; // obtain DataCue
                    console.log(`DataCue for ${forValue}:`, currentCue.value, currentCue.type);

                    if( currentCue.type === 'org.webvmt.lighting-example' ) {
                        drawLight({ lightId: forValue, ...currentCue.value, text: JSON.stringify(currentCue.value, null, 2) });
                    }
                } else {
                    initLight(forValue);
                }
            })
            initLight(forValue);
        }
    }
}

init();