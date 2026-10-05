"use client";

import Link from "next/link";
import { useState } from "react";

export default function HeaderClient({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);

    async function logout() {
        await fetch("/api/logout", {
            method: "POST",
        });

        window.location.href = "/";
    }

    return (
        <header>
            <a href="/" className="logo">
                <img
                    className="logoheader"
                    src="/logo.png"
                    alt="Linc"
                />

                <h1>Linc</h1>
            </a>

            <div className="linkssite">
                <a href="#support">Support</a>
                <a href="#prices">Prices</a>

                {user ? (
                    <div className="user-menu">

                        <button
                            className="user-button"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <div className="user-avatar">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            <span className="usernameheader">{user.username}</span>
                        </button>

                        {menuOpen && (
                            <div className="user-dropdown">

                                <Link href="/dashboard">
                                    Dashboard
                                </Link>

                                <Link href={`/${user.username}`}>
                                    My profile
                                </Link>

                                <button onClick={logout}>
                                    Log out
                                </button>

                            </div>
                        )}

                    </div>
                ) : (
                    <>
                        <Link href="/reg">
                            Registration
                        </Link>

                        <Link href="/login">
                            Log In
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}