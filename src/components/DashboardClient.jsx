"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboard.css";

export default function DashboardClient({ user }) {

    const [activeTab, setActiveTab] = useState("overview");

    const [profile, setProfile] = useState({
        description: "",
        avatar: "",
        background: "",
        font: "Manrope",
        textColor: "#ffffff"
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {

        async function loadProfile() {

            try {

                const response = await fetch("/api/profile");

                if (!response.ok) {
                    throw new Error("Failed to load profile");
                }

                const data = await response.json();

                if (data.profile) {
                    setProfile({
                        description: data.profile.description || "",
                        avatar: data.profile.avatar || "",
                        background: data.profile.background || "",
                        font: data.profile.font || "Manrope",
                        textColor: data.profile.textColor || "#ffffff"
                    });
                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        }

        loadProfile();

    }, []);


    function updateProfile(field, value) {

        setProfile(prev => ({
            ...prev,
            [field]: value
        }));

    }


    async function saveProfile() {

        setSaving(true);
        setMessage("");

        try {

            const response = await fetch("/api/profile", {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(profile)
            });

            if (!response.ok) {
                throw new Error("Failed to save profile");
            }

            setMessage("Profile saved successfully.");

        } catch (error) {

            console.error(error);

            setMessage("Failed to save profile.");

        } finally {

            setSaving(false);

            setTimeout(() => {
                setMessage("");
            }, 3000);

        }
    }


    async function logout() {

        await fetch("/api/logout", {
            method: "POST"
        });

        window.location.href = "/";
    }


    return (
        <main className="dashboard">

            <aside className="dashboard-sidebar">

                <div className="dashboard-logo">
                    <img
                        src="/logo.png"
                        alt="Linc"
                    />

                    <span>Linc</span>
                </div>


                <div className="dashboard-user">

                    <div className="dashboard-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <strong>{user.username}</strong>
                        <span>Free</span>
                    </div>

                </div>


                <nav className="dashboard-nav">

                    <button
                        className={activeTab === "overview" ? "active" : ""}
                        onClick={() => setActiveTab("overview")}
                    >
                        Overview
                    </button>

                    <button
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile
                    </button>

                    <button
                        className={activeTab === "links" ? "active" : ""}
                        onClick={() => setActiveTab("links")}
                    >
                        Links
                    </button>

                    <button
                        className={activeTab === "music" ? "active" : ""}
                        onClick={() => setActiveTab("music")}
                    >
                        Music
                    </button>

                    <button
                        className={activeTab === "settings" ? "active" : ""}
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </button>

                </nav>


                <div className="dashboard-bottom">

                    <Link href={`/${user.username}`}>
                        View profile
                    </Link>

                    <button onClick={logout}>
                        Log out
                    </button>

                </div>

            </aside>


            <section className="dashboard-content">

                {activeTab === "overview" && (

                    <div className="dashboard-section">

                        <div className="section-heading">
                            <div>
                                <span className="eyebrow">
                                    Dashboard
                                </span>

                                <h1>
                                    Welcome, {user.username}
                                </h1>

                                <p>
                                    Manage your Linc profile and account.
                                </p>
                            </div>

                            <Link
                                className="view-profile"
                                href={`/${user.username}`}
                            >
                                View profile
                            </Link>
                        </div>


                        <div className="overview-grid">

                            <div className="dashboard-card">

                                <span>Username</span>

                                <strong>
                                    {user.username}
                                </strong>

                            </div>


                            <div className="dashboard-card">

                                <span>Plan</span>

                                <strong>
                                    Free
                                </strong>

                            </div>


                            <div className="dashboard-card">

                                <span>Profile</span>

                                <strong>
                                    /{user.username}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}


                {activeTab === "profile" && (

                    <div className="dashboard-section">

                        <div className="section-heading">

                            <div>
                                <span className="eyebrow">
                                    Profile
                                </span>

                                <h1>
                                    Customize your profile
                                </h1>

                                <p>
                                    Make your Linc page feel like yours.
                                </p>
                            </div>

                        </div>


                        {loading ? (

                            <p className="loading">
                                Loading profile...
                            </p>

                        ) : (

                            <div className="editor">

                                <div className="form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value={profile.description}
                                        onChange={(e) =>
                                            updateProfile(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Tell people something about yourself..."
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Avatar URL
                                    </label>

                                    <input
                                        type="text"
                                        value={profile.avatar}
                                        onChange={(e) =>
                                            updateProfile(
                                                "avatar",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://..."
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Background URL
                                    </label>

                                    <input
                                        type="text"
                                        value={profile.background}
                                        onChange={(e) =>
                                            updateProfile(
                                                "background",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://..."
                                    />

                                </div>


                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Font
                                        </label>

                                        <select
                                            value={profile.font}
                                            onChange={(e) =>
                                                updateProfile(
                                                    "font",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Manrope">
                                                Manrope
                                            </option>

                                            <option value="Inter">
                                                Inter
                                            </option>

                                            <option value="Arial">
                                                Arial
                                            </option>

                                            <option value="Georgia">
                                                Georgia
                                            </option>
                                        </select>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Text color
                                        </label>

                                        <input
                                            type="text"
                                            value={profile.textColor}
                                            onChange={(e) =>
                                                updateProfile(
                                                    "textColor",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="#ffffff"
                                        />

                                    </div>

                                </div>


                                <div className="editor-footer">

                                    <span>
                                        {message}
                                    </span>

                                    <button
                                        onClick={saveProfile}
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save changes"}
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                )}


                {activeTab === "links" && (

                    <div className="empty-section">

                        <span className="eyebrow">
                            Links
                        </span>

                        <h1>
                            Social links
                        </h1>

                        <p>
                            Add your social networks to your Linc profile.
                        </p>

                        <span className="coming-soon">
                            Coming soon
                        </span>

                    </div>

                )}


                {activeTab === "music" && (

                    <div className="empty-section">

                        <span className="eyebrow">
                            Music
                        </span>

                        <h1>
                            Your music
                        </h1>

                        <p>
                            Add music to your Linc profile.
                        </p>

                        <span className="coming-soon">
                            Coming soon
                        </span>

                    </div>

                )}


                {activeTab === "settings" && (

                    <div className="empty-section">

                        <span className="eyebrow">
                            Settings
                        </span>

                        <h1>
                            Account settings
                        </h1>

                        <p>
                            Manage your Linc account.
                        </p>

                        <span className="coming-soon">
                            Coming soon
                        </span>

                    </div>

                )}

            </section>

        </main>
    );
}