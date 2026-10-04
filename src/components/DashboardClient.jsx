"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboard.css";

export default function DashboardClient({ user }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
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

        async function handleAvatarUpload(e) {
        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/avatar", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Upload failed");
            return;
        }

        setProfile(prev => ({
            ...prev,
            avatar: data.url
        }));
    }

    async function handleBackgroundUpload(e) {
        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/background", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Upload failed");
            return;
        }

        setProfile(prev => ({
            ...prev,
            background: data.url
        }));
    }

    function updateProfile(field, value) {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    }

        async function uploadImage(file, type) {
        if (!file) return;

        setMessage("");

        const formData = new FormData();

        formData.append("file", file);
        formData.append("type", type);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setProfile(prev => ({
                ...prev,
                [type]: data.url
            }));

            setMessage(
                type === "avatar"
                    ? "Avatar uploaded successfully."
                    : "Background uploaded successfully."
            );

        } catch (error) {
            console.error(error);
            setMessage(error.message);
        }
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
                <a href="/" className="dashboard-logo">
                    <img src="/logo.png" alt="Linc" />
                    <span>Linc</span>
                </a>

                <div className="dashboard-user">
                    <div className="dashboard-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <strong>{user.username}</strong>
                        <span>Free</span>
                        <span>UID</span>
                        <strong>#{user.uid}</strong>
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
                                <strong>{user.username}</strong>
                            </div>

                            <div className="dashboard-card">
                                <span>Plan</span>
                                <strong>Free</strong>
                            </div>

                            <div className="dashboard-card">
                                <span>Profile</span>
                                <strong>/{user.username}</strong>
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
                                    <label>Description</label>

                                    <textarea
                                        maxLength={500}
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
                                    <label>Avatar</label>

                                    <label className="upload-box avatar-upload">
                                        {profile.avatar ? (
                                            <img
                                                src={profile.avatar}
                                                alt="Avatar preview"
                                            />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <span>+</span>
                                                <p>Choose avatar</p>
                                                <small>PNG, JPG or WebP</small>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(e) =>
                                                uploadImage(
                                                    e.target.files[0],
                                                    "avatar"
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Background</label>

                                    <label className="upload-box background-upload">
                                        {profile.background ? (
                                            <img
                                                src={profile.background}
                                                alt="Background preview"
                                            />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <span>+</span>
                                                <p>Choose background</p>
                                                <small>PNG, JPG or WebP</small>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(e) =>
                                                uploadImage(
                                                    e.target.files[0],
                                                    "background"
                                                )
                                            }
                                        />
                                    </label>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Font</label>

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
                                        <label>Text color</label>

                                        <div className="custom-color-picker">
                                            <button
                                                type="button"
                                                className="color-trigger"
                                                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                                            >
                                                <span
                                                    className="color-preview"
                                                    style={{
                                                        background: profile.textColor || "#ffffff"
                                                    }}
                                                />

                                                <span>
                                                    {profile.textColor
                                                        ? profile.textColor
                                                        : "Choose a color"}
                                                </span>

                                                <span className="color-arrow">
                                                    {colorPickerOpen ? "⌃" : "⌄"}
                                                </span>
                                            </button>

                                            {colorPickerOpen && (
                                                <div className="color-panel">
                                                    <div className="color-grid">
                                                        {[
                                                            "#FFFFFF",
                                                            "#E5E7EB",
                                                            "#9CA3AF",
                                                            "#60A5FA",
                                                            "#3B82F6",
                                                            "#818CF8",
                                                            "#A78BFA",
                                                            "#C084FC",
                                                            "#F472B6",
                                                            "#FB7185",
                                                            "#F87171",
                                                            "#FB923C",
                                                            "#FACC15",
                                                            "#4ADE80",
                                                            "#34D399",
                                                            "#2DD4BF",
                                                            "#22D3EE"
                                                        ].map((color) => (
                                                            <button
                                                                key={color}
                                                                type="button"
                                                                className={`color-item ${
                                                                    profile.textColor === color
                                                                        ? "selected"
                                                                        : ""
                                                                }`}
                                                                style={{
                                                                    backgroundColor: color
                                                                }}
                                                                onClick={() => {
                                                                    updateProfile(
                                                                        "textColor",
                                                                        color
                                                                    );
                                                                    setColorPickerOpen(false);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>

                                                    <div className="custom-color">
                                                        <span>Custom color</span>

                                                        <input
                                                            type="color"
                                                            value={profile.textColor || "#ffffff"}
                                                            onChange={(e) =>
                                                                updateProfile(
                                                                    "textColor",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="editor-footer">
                                    <span>{message}</span>

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