"use client";

import Link from "next/link";
import "./style.css";
import {
  Button,
  ButtonVariantType,
  IconButton,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ThemeType,
} from "basicui";
import { DarkModeState } from "@/store/ProfileStore";
import { useEffect, useState } from "react";
import Logo from "../Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import Timer from "./Timer";
import { useMsal } from '@azure/msal-react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [authorization, setAuthorization] = useState<Authorization>({});
  const router = useRouter();
  const { instance } = useMsal();

  useEffect(() => {
    DarkModeState.subscribe((message) => {
      setDarkMode(message);
    });
  }, []);

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      console.log(message);
      setAuthorization(message);
    });
  }, []);

  const toggleDarkMode = () => {
    DarkModeState.next(!DarkModeState.value);
  };

  const logout = () => {
    sessionStorage.clear();
    AuthorizationState.next({});
    router.push("/login");
    setIsLogoutDialogOpen(false);
    handleLogout();
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <>
      <nav className="navbar">
        <Logo />
        {authorization?.isAuth && (
          <>
            <ul>
              {/* <li>
              <Link href="/assessment/list">Candidate Assessment</Link>
            </li>
            <li>
              <Link href="/resume/list">Resume screener</Link>
            </li> */}
            </ul>
            <div className="navbar_right">
              {/* <Timer /> */}
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
              <div className="logout">
                <IconButton
                  onClick={() => setIsLogoutDialogOpen(true)}
                  circle
                  theme={ThemeType.primary}
                  variant={ButtonVariantType.outline}
                >
                  <FontAwesomeIcon icon={faPowerOff} size="xs" />
                </IconButton>
              </div>
            </div>
          </>
        )}
      </nav>
      <Modal
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsLogoutDialogOpen(false)}
          heading="Confirm Logout"
        />

        <ModalBody>
          <div className="new-project-dialog">
            <p>Are you sure you want to log out?</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary} onClick={logout}>
            Confirm
          </Button>
          <Button onClick={() => setIsLogoutDialogOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Navbar;
