import { useState } from "react";

import Menu from "./pages/Menu";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";

export default function App() {

  return (
    <>
      <Menu />
      <Notifications />
      <Login />
    </>
  )
}
