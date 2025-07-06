import React, { useState, useRef, useEffect } from "react";
import styles from "./hamburger-menu.module.css";
import { Divide as Hamburger } from "hamburger-react";
import { useList } from "../context-hook.tsx";

const HamburgerMenu: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { userLogout } = useList();
	const menuRef = useRef<HTMLDivElement>(null);

	// Close the menu when the user clicks outside of it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className={`${styles.hamburgerContainer} ${isOpen ? styles.open : ""}`} ref={menuRef}>
			<Hamburger toggled={isOpen} toggle={setIsOpen} />
			<nav className={`${styles.menuDropdown} ${isOpen ? styles.open : ""}`}>
				<ul>
					<li>
						<a href="/dashboard">Your Lists</a>
					</li>
					<li>
						<a href="/reset-email">Reset Email</a>
					</li>
					<li>
						<a href="/reset-password">
							<p>Reset Password</p>
						</a>
					</li>
					<li>
						<button onClick={userLogout} id={styles["logout"]}>
							<p>Logout</p>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default HamburgerMenu;
