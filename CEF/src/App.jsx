import { useState } from "react";

import Menu from "./pages/Menu";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Speedometers from "./pages/Speedometers.jsx";

export default function App() {

  return (
    <>
      <Menu />
      <Notifications />
      <Login />
      <Speedometers />
    </>
  )
}
