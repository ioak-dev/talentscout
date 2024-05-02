"use client";

import Link from "next/link";
import "./style.css";
import { Button, ButtonVariantType, IconButton, ThemeType } from "basicui";
import { DarkModeState } from "@/store/ProfileStore";
import { useEffect, useState } from "react";
import Logo from "../Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

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
      <Logo />
      <ul>
        <li>
          <Link href="/assessment/list">Candidate Assessment</Link>
        </li>
        <li>
          <Link href="/resume/list">Resume screener</Link>
        </li>
      </ul>
      <div>
        {darkMode && (
          <IconButton
            onClick={toggleDarkMode}
            circle
            theme={ThemeType.primary}
            variant={ButtonVariantType.outline}
          >
            <FontAwesomeIcon icon={faSun} />
          </IconButton>
        )}
        {!darkMode && (
          <IconButton
            circle
            theme={ThemeType.primary}
            onClick={toggleDarkMode}
            variant={ButtonVariantType.outline}
          >
            <FontAwesomeIcon icon={faMoon} />
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
