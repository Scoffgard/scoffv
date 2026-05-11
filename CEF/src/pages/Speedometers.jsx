import { useEffect, useState } from "react";

import Forza4Digital from "../components/Forza4Digital.jsx";

import '../styles/pages/Speedometers.scss';
import Forza5Digital from "../components/Forza5Digital.jsx";

export default function Speedometers() {

  const [gear, setGear] = useState('N');
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0.1);
  const [mode, setMode] = useState(0);

  const [speedoState, setSpeedoState] = useState(false);
  const [speedoDesign, setSpeedoDesign] = useState('FH5');

  useEffect(() => {
    if (window.mp) {
      window.mp.events.add('browser:speedo:setGear', setGear);
      window.mp.events.add('browser:speedo:setSpeed', setSpeed);
      window.mp.events.add('browser:speedo:setRPM', setRpm);
      window.mp.events.add('browser:speedo:setMode', setMode);
      window.mp.events.add('browser:speedo:setState', setSpeedoState);
      window.mp.events.add('browser:speedo:setDesign', setSpeedoDesign);
      return () => {
        window.mp.events.remove('browser:speedo:setGear', setGear);
        window.mp.events.remove('browser:speedo:setSpeed', setSpeed);
        window.mp.events.remove('browser:speedo:setRPM', setRpm);
        window.mp.events.remove('browser:speedo:setMode', setMode);
        window.mp.events.remove('browser:speedo:setState', setSpeedoState);
        window.mp.events.remove('browser:speedo:setDesign', setSpeedoDesign);
      }
    }
  }, []);

  return (
    <div className={`speedometersWrapper ${speedoState ? '' : 'hidden'}`}>
      {speedoDesign === 'FH4' && <Forza4Digital gear={gear} speed={speed} rpm={rpm} mode={mode} />}
      {speedoDesign === 'FH5' && <Forza5Digital gear={gear} speed={speed} rpm={rpm} mode={mode} />}
    </div>
  );
}