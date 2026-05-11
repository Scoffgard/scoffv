import { useEffect, useState } from "react";

// THE FOLLOWING COMPONENT IS A MODIFICATION OF : https://github.com/MyHwu9508/altv-os-speedometer-collection/tree/master
export default function Forza4Digital(props) {
  const PIN_OFFSET = 14.3;

  const DARK_GREY_RGB = 100;
  const DARK_OPACITY = 0.5;
  const DARK_GREY_STRING = `${DARK_GREY_RGB},${DARK_GREY_RGB},${DARK_GREY_RGB},${DARK_OPACITY}`;

  const [activePins, setActivePins] = useState(0);
  const [speedDigits, setSpeedDigits] = useState('000');

  function refreshActivePins() {
    const newActivePins = ((props.rpm * 100) / 9000) * 100 * 42;
    setActivePins(newActivePins > 42 ? 42 : newActivePins);
  }

  function getPinColorString(index, activePins) {
    if (index > activePins) return DARK_GREY_STRING;
    const color = 130 + index * (125 / activePins);
    return `${color},${color},${color},${0.6 + index * (0.4 / activePins)}`;
  }

  function getGearColorString(activePins) {
    if (activePins > 41) return "210, 60, 90";
    if (props.gear == "N") return DARK_GREY_STRING;
    return "36, 148, 90";
  }

  const speedToString = (speed) => String(speed).padStart(3, '0');

  const generatePins = () => {
    const pins = []
    for (let index = 0; index < 43; index++) {
      pins.push(
        <polyline
          style={{fill: `rgb(${getPinColorString(index, activePins)})`, stroke: 'rgb(45,45,45)'}} 
          stroke-width="0.3"
          points={`${275 + index * PIN_OFFSET} 465 ${270 + index * PIN_OFFSET} 505 ${280 + index * PIN_OFFSET} 505 ${285 + index * PIN_OFFSET} 465`}
        ></polyline>
      );
    }
    return pins;
  }
  const generatePinsRed = () => {
    const pins = []
    for (let index = 0; index < 5; index++) {
      pins.push(
        <polyline
          style={{fill: 'rgb(198, 45, 79)'}}
          points={`${890 + index * PIN_OFFSET} 465 ${883 + index * PIN_OFFSET} 520 ${893 + index * PIN_OFFSET} 520 ${900 + index * PIN_OFFSET} 465`}
        ></polyline>
      );
    }
    return pins;
  }

  useEffect(() => {
    refreshActivePins();
  }, [props.rpm]);
  
  useEffect(() => {
    setSpeedDigits(speedToString(props.speed));
  }, [props.speed])

  return (
    <svg viewBox="263.224 50.046 757.757 489.982" xmlns="http://www.w3.org/2000/svg">
      <ellipse style={{fill: 'none', stroke: `rgb(${getGearColorString(activePins)})`, strokeWidth: 7 + 'px'}} cx="345" cy="362" rx="65" ry="65">
        
      </ellipse>
      <text style={{fill: `rgb(${getGearColorString(activePins)})`, fontFamily: 'Oswald', fontStyle: 'italic', fontSize: 110 + 'px', whiteSpace: 'pre', textAnchor: 'middle'}} x="335" y="400" transform="matrix(1, 0, 0, 0.859699, 0, 54.835201)">
        {props.gear}
      </text>
      <text style={{fill: `rgb(255,255,255)`,fontFamily: 'Oswald', fontWeight: 300, fontSize: 221 + 'px', fontStyle: 'italic', textAnchor: 'middle', whiteSpace: 'pre'}} transform="matrix(1.361103, 0, 0, 1.495456, 145.761597, -214.717682)" x="468" y="440.769">
        {speedDigits[2]}
      </text>
      <text style={{fill: `rgb(${speedDigits[0] == '0' && speedDigits[1] == '0' ? DARK_GREY_STRING : '255,255,255'})`, fontFamily: 'Oswald', fontWeight: 300, fontSize: 221 + 'px', fontStyle: 'italic', textAnchor: 'middle', whiteSpace: 'pre'}} transform="matrix(1.317652, 0, 0, 1.495456, 23.614737, -214.717682)" x="468" y="440.769">
        {speedDigits[1]}
      </text>
      <text style={{fill: `rgb(${speedDigits[0] == '0' ? DARK_GREY_STRING : '255,255,255'})`, fontFamily: 'Oswald', fontWeight: 300, fontSize: 221 + 'px', fontStyle: 'italic', textAnchor: 'middle', whiteSpace: 'pre'}} transform="matrix(1.295944, 0, 0, 1.495456, -109.465935, -214.717682)" x="468" y="440.769">
        {speedDigits[0]}
      </text>
      <text style={{fill: `rgb(${DARK_GREY_STRING})`, fontFamily: 'Oswald', fontSize: 41.5 + 'px', fontStyle: 'italic', fontWeight: 700, whiteSpace: 'pre'}} transform="matrix(1.11327, 0, 0, 1.127155, -104.321404, -31.802149)" x="921" y="222.244">{props.mode == 0 ? "KMH" : "MPH"}</text>
      <text style={{fill: `rgb(${DARK_GREY_STRING})`, fontFamily: 'Oswald', fontSize: 41.5 + 'px', fontStyle: 'italic', fontWeight: 700, whiteSpace: 'pre'}} x="909.221" y="344.244">ABS</text>
      <text style={{fill: `rgb(${DARK_GREY_STRING})`, fontFamily: 'Oswald', fontSize: 41.5 + 'px', fontStyle: 'italic', fontWeight: 700, letterSpacing: 2.2 + 'px', whiteSpace: 'pre'}} transform="matrix(1.078961, 0, 0, 1, -73.985855, 0)" x="899" y="391.244">TCR</text>
      <text style={{fill: `rgb(${DARK_GREY_STRING})`, fontFamily: 'Oswald', fontSize: 41.5 + 'px', fontStyle: 'italic', fontWeight: 700, whiteSpace: 'pre'}} x="885" y="442.244">STM</text>
      {generatePins()}
      {generatePinsRed()}
      <line style={{fill: 'rgb(216, 216, 216)', stroke: `rgb(${DARK_GREY_STRING})`, strokeWidth: 10 + 'px'}} x1="270" y1="515" x2="880" y2="515"></line>
      <defs>
        <linearGradient id="greydient" x1="270" y1="515" x2={275 + activePins * PIN_OFFSET} y2="515" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgb(130,130,130,0.6)" offset="0" />
          <stop stop-color="white" offset="1" />
        </linearGradient>
      </defs>
      <line style={{strokeWidth: 10 + 'px', stroke: 'url(#greydient)'}} x1="270" y1="515" x2={275 + activePins * PIN_OFFSET} y2="515"></line>
      <filter id="blurStrong">
        <feGaussianBlur in="SourceGraphic" x="270" y="505" width="610" height="20" stdDeviation="3" />
      </filter>
      <filter id="blurWeak">
        <feGaussianBlur in="SourceGraphic" x="270" y="505" width="610" height="20" stdDeviation="1" />
      </filter>
      <ellipse cx={275 + activePins * PIN_OFFSET} cy="515" rx="6" ry="8" filter="url(#blurWeak)" fill="white" />
      <ellipse cx={275 + activePins * PIN_OFFSET} cy="515" rx="18" ry="9" filter="url(#blurStrong)" opacity="0.7" fill="white" />
    </svg>
  )
}