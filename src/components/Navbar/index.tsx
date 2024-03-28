"use client";

import Link from "next/link";
import "./style.css";
import { Button } from "basicui";
import { DarkModeState } from "@/store/profile";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    DarkModeState.subscribe((message) => {
      setDarkMode(message);
    });
  }, []);

  const toggleDarkMode = () => {
    DarkModeState.next(!DarkModeState.value);
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/assessments">Assessments</Link>
        </li>
      </ul>
      <div>
        {darkMode && <Button onClick={toggleDarkMode}>Light</Button>}
        {!darkMode && <Button onClick={toggleDarkMode}>Dark</Button>}
      </div>
    </nav>
  );
};

export default Navbar;
