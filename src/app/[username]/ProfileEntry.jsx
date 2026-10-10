
"use client";

import { useState } from "react";

export default function ProfileEntry({ username, children }) {
    const [entered, setEntered] = useState(false);
    const [loading, setLoading] = useState(false);

    async function enterProfile() {
        if (entered || loading) return;

        setLoading(true);

        // Запускаем музыку непосредственно в обработчике клика.
        window.dispatchEvent(new Event("linxy:enter-profile"));

        setEntered(true);

        try {
            const key = `linxy-view-${username}`;
            if (!sessionStorage.getItem(key)) {
                const response = await fetch("/api/view", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username }),
                });

                if (response.ok) {
                    sessionStorage.setItem(key, "1");
                }
            }
        } catch (error) {
            console.error("PROFILE_ENTRY_ERROR:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="profile-entry-wrapper">
            {children}

            {!entered && (
                <button
                    type="button"
                    className="profile-entry-overlay"
                    onClick={enterProfile}
                    aria-label={`Enter ${username}'s profile`}
                >
                    <span className="profile-entry-label">
                        Click To Show Profile
                    </span>

                    <span className="profile-entry-username">
                        {username}
                    </span>
                </button>
            )}
        </div>
    );
}
