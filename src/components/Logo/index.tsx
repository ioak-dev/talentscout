import React, { useEffect, useState } from 'react';
import './style.css';
import logoWhite from '@/svg/logo-no-background.svg';
import { DarkModeState } from '@/store/ProfileStore';

interface Props {
}

const Logo = (props: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    DarkModeState.subscribe((message) => {
      setDarkMode(message);
    });
    console.log(logoWhite)
  }, []);

  return (
    <div className="logo">
      {/* <div className="logo--image">
        {!darkMode && (
          <img src={logoWhite.src} alt="Talentprobe logo" />
        )}
        {darkMode && (
          <img src={logoWhite.src} alt="Talentprobe logo" />
        )}
      </div> */}
    </div>
  );
};

export default Logo;
