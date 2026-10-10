    "use client";

    import { useEffect, useState } from "react";
    import Link from "next/link";
    import "./dashboard.css";
    import {
        siGithub,
        siTelegram,
        siDiscord,
        siYoutube,
        siInstagram,
        siTiktok,
        siSpotify,
        siTwitch,
        siX,
        siVk,
        siReddit,
        siSteam,
        siSoundcloud,
        siPinterest,
        siFacebook,
        siSnapchat,
        siWhatsapp,
        siGitlab,
        siBitbucket,
        siDribbble,
        siBehance,
        siMedium,
        siPatreon,
        siKick,
        siThreads,
        siBluesky,
        siTumblr,
        siMastodon
    } from "simple-icons";

    const COLORS = [
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
    ];

    const LINK_ICONS = {
        github: siGithub,
        telegram: siTelegram,
        discord: siDiscord,
        youtube: siYoutube,
        instagram: siInstagram,
        tiktok: siTiktok,
        spotify: siSpotify,
        twitch: siTwitch,
        twitter: siX,
        vk: siVk,
        reddit: siReddit,
        steam: siSteam,
        soundcloud: siSoundcloud,
        pinterest: siPinterest,
        facebook: siFacebook,
        snapchat: siSnapchat,
        whatsapp: siWhatsapp,
        gitlab: siGitlab,
        bitbucket: siBitbucket,
        dribbble: siDribbble,
        behance: siBehance,
        medium: siMedium,
        patreon: siPatreon,
        kick: siKick,
        threads: siThreads,
        bluesky: siBluesky,
        tumblr: siTumblr,
        mastodon: siMastodon
    };

    function LinkIcon({ name, className = "social-icon" }) {
        const icon = LINK_ICONS[name];

        if (!icon) {
            return <span>↗</span>;
        }

        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={className}
            >
                <path d={icon.path} />
            </svg>
        );
    }

    function ColorPicker({ value, onChange, open, setOpen }) {
        const currentColor = value || "#FFFFFF";

        return (
            <div className="custom-color-picker">
                <button
                    type="button"
                    className="color-trigger"
                    onClick={() => setOpen(!open)}
                >
                    <span
                        className="color-preview"
                        style={{ background: currentColor }}
                    />
                    <span>{currentColor}</span>
                    <span className="color-arrow">
                        {open ? "⌃" : "⌄"}
                    </span>
                </button>

                {open && (
                    <div className="color-panel">
                        <div className="color-grid">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-item ${
                                        currentColor.toUpperCase() === color
                                            ? "selected"
                                            : ""
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        onChange(color);
                                        setOpen(false);
                                    }}
                                />
                            ))}
                        </div>

                        <div className="custom-color">
                            <span>Custom color</span>
                            <input
                                type="color"
                                value={currentColor}
                                onChange={(e) =>
                                    onChange(e.target.value.toUpperCase())
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    export default function DashboardClient({ user }) {
        const [activeTab, setActiveTab] = useState("overview");

        const [profile, setProfile] = useState({
            description: "",
            avatar: "",
            background: "",
            font: "Manrope",
            textColor: "#ffffff",
            descriptionColor: "#ffffff",
            iconColor: "#ffffff",
            backgroundType: "image",
            musicUrl:"",
            musicTitle:"",
            musicArtist:"",
            musicCover:""
        });

        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [message, setMessage] = useState("");

        const [colorPickerOpen, setColorPickerOpen] = useState(null);

        const [links, setLinks] = useState([]);
        const [linksLoading, setLinksLoading] = useState(false);
        const [linkModalOpen, setLinkModalOpen] = useState(false);
        const [editingLink, setEditingLink] = useState(null);

        const [linkForm, setLinkForm] = useState({
            title: "",
            url: "",
            icon: "github"
        });

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
                            backgroundType: data.profile.backgroundType || "image",
                            font: data.profile.font || "Manrope",
                            textColor: data.profile.textColor || "#ffffff",
                            descriptionColor:data.profile.descriptionColor || "#ffffff",
                            iconColor:data.profile.iconColor || "#ffffff",
                            musicUrl: data.profile.musicUrl || "",
                            musicTitle: data.profile.musicTitle || "",
                            musicArtist: data.profile.musicArtist || "",
                            musicCover: data.profile.musicCover || ""
                        });
                    }
                } catch (error) {
                    console.error("PROFILE_LOAD_ERROR:", error);
                } finally {
                    setLoading(false);
                }
            }

            loadProfile();
        }, []);

        useEffect(() => {
            async function loadLinks() {
                setLinksLoading(true);

                try {
                    const response = await fetch("/api/links");

                    if (!response.ok) {
                        throw new Error("Failed to load links");
                    }

                    const data = await response.json();
                    setLinks(data.links || []);
                } catch (error) {
                    console.error("LINKS_LOAD_ERROR:", error);
                } finally {
                    setLinksLoading(false);
                }
            }

            loadLinks();
        }, []);

        function updateProfile(field, value) {
            setProfile((prev) => ({
                ...prev,
                [field]: value,
            }));
        }

        function toggleColorPicker(name) {
            setColorPickerOpen((current) =>
                current === name ? null : name
            );
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
                console.log("UPLOAD RESPONSE:", data);

                if (!response.ok) {
                    throw new Error(data.error || "Upload failed");
                }
                const isVideo = file.type.startsWith("video/");

                   
                setProfile((prev) => {
                    const updated = {
                        ...prev,
                        ...(type === "music"
                            ? {
                                musicUrl: data.url,
                                musicCover: data.coverUrl || ""
                            }
                            : {
                                [type]: data.url
                            }),
                        ...(type === "background"
                            ? {
                                backgroundType: isVideo ? "video" : "image"
                            }
                            : {})
                    };

                    console.log("PROFILE AFTER UPLOAD:", {
                        musicUrl: updated.musicUrl,
                        musicCover: updated.musicCover
                    });

                    return updated;
                });

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

    const saveProfile = async () => {
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

            const data = await response.json();
            console.log("SENDING MUSIC COVER:", profile.musicCover);
            console.log("SAVED MUSIC COVER:", data.profile?.musicCover);

            console.log("PROFILE SAVE RESPONSE:", data);

            if (!response.ok) {
                throw new Error(data.error || "Failed to save profile");
            }

            setProfile(data.profile);
            setMessage("Profile saved successfully");
        } catch (error) {
            console.error("SAVE PROFILE ERROR:", error);
            setMessage(error.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

        async function logout() {
            await fetch("/api/logout", {
                method: "POST"
            });

            window.location.href = "/";
        }

        function openAddLink() {
            if (links.length >= 5) {
                alert("You can add up to 5 links.");
                return;
            }

            setEditingLink(null);
            setLinkForm({
                title: "",
                url: "",
                icon: "github"
            });
            setLinkModalOpen(true);
        }

        function openEditLink(link) {
            setEditingLink(link);
            setLinkForm({
                title: link.title,
                url: link.url,
                icon: link.icon
            });
            setLinkModalOpen(true);
        }

        async function saveLink() {
            if (!linkForm.title || !linkForm.url || !linkForm.icon) {
                return;
            }

            try {
                const response = await fetch("/api/links", {
                    method: editingLink ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        editingLink
                            ? {
                                id: editingLink.id,
                                ...linkForm
                            }
                            : linkForm
                    )
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to save link"
                    );
                }

                if (editingLink) {
                    setLinks((prev) =>
                        prev.map((link) =>
                            link.id === editingLink.id
                                ? data.link
                                : link
                        )
                    );
                } else {
                    setLinks((prev) => [...prev, data.link]);
                }

                setLinkModalOpen(false);
                setEditingLink(null);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }

        async function deleteLink(id) {
            try {
                const response = await fetch("/api/links", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to delete link"
                    );
                }

                setLinks((prev) =>
                    prev.filter((link) => link.id !== id)
                );
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }

        return (
            <main className="dashboard">
                <aside className="dashboard-sidebar">
                    <a href="/" className="dashboard-logo">
                        <img src="/logo.png" alt="Linxy" />
                        <span>Linxy</span>
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
                        {[
                            ["overview", "Overview"],
                            ["profile", "Profile"],
                            ["links", "Links"],
                            ["music", "Music"],
                            ["settings", "Settings"]
                        ].map(([tab, label]) => (
                            <button
                                key={tab}
                                className={
                                    activeTab === tab ? "active" : ""
                                }
                                onClick={() => setActiveTab(tab)}
                            >
                                {label}
                            </button>
                        ))}
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
                                        Manage your Linxy profile and account.
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
                                        Make your Linxy page feel like yours.
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <p className="loading">
                                    Loading profile...
                                </p>
                            ) : (
                                <div className="editor">
                                    <div className="profile-top-row">
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
                                                        <p>
                                                            Choose avatar
                                                        </p>
                                                        <small>
                                                            PNG, JPG or WebP
                                                        </small>
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
                                    </div>

                                    <div className="form-group">
                                        <label>Background</label>

                                       <label className="upload-box background-upload">
                                        {profile.background ? (
                                            profile.backgroundType === "video" ? (
                                                <video
                                                    src={profile.background}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={profile.background}
                                                    alt="Background preview"
                                                />
                                            )
                                        ) : (
                                            <div className="upload-placeholder">
                                                <span>+</span>
                                                <p>Choose background</p>
                                                <small>
                                                    PNG, JPG, WebP, MP4 or WebM
                                                </small>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
                                            onChange={(e) =>
                                                uploadImage(
                                                    e.target.files[0],
                                                    "background"
                                                )
                                            }
                                        />
                                    </label>
                                    </div>

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

                                    <div className="profile-colors">
                                        <div className="color-control">
                                            <label>Name color</label>

                                            <ColorPicker
                                                value={profile.textColor}
                                                onChange={(color) =>
                                                    updateProfile(
                                                        "textColor",
                                                        color
                                                    )
                                                }
                                                open={
                                                    colorPickerOpen === "name"
                                                }
                                                setOpen={() =>
                                                    toggleColorPicker("name")
                                                }
                                            />
                                        </div>

                                        <div className="color-control">
                                            <label>
                                                Description color
                                            </label>

                                            <ColorPicker
                                                value={
                                                    profile.descriptionColor
                                                }
                                                onChange={(color) =>
                                                    updateProfile(
                                                        "descriptionColor",
                                                        color
                                                    )
                                                }
                                                open={
                                                    colorPickerOpen ===
                                                    "description"
                                                }
                                                setOpen={() =>
                                                    toggleColorPicker(
                                                        "description"
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="color-control">
                                            <label>Icon color</label>

                                            <ColorPicker
                                                value={profile.iconColor}
                                                onChange={(color) =>
                                                    updateProfile(
                                                        "iconColor",
                                                        color
                                                    )
                                                }
                                                open={
                                                    colorPickerOpen === "icon"
                                                }
                                                setOpen={() =>
                                                    toggleColorPicker("icon")
                                                }
                                            />
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
                        <div className="dashboard-section">
                            <div className="section-heading">
                                <div>
                                    <span className="eyebrow">
                                        Links
                                    </span>

                                    <h1>Social links</h1>

                                    <p>
                                        Add links to your social networks and
                                        websites.
                                    </p>
                                </div>

                                {links.length < 5 && (
                                    <button
                                        className="add-link-button"
                                        onClick={openAddLink}
                                    >
                                        + Add Link
                                    </button>
                                )}
                            </div>

                            {linksLoading ? (
                                <p className="loading">
                                    Loading links...
                                </p>
                            ) : links.length === 0 ? (
                                <div />
                            ) : (
                                <div className="links-list">
                                    {links.map((link) => (
                                        <div
                                            className="link-item"
                                            key={link.id}
                                        >
                                            <div className="link-icon">
                                                <LinkIcon
                                                    name={link.icon}
                                                />
                                            </div>

                                            <div className="link-info">
                                                <strong>
                                                    {link.title}
                                                </strong>

                                                <span>
                                                    {link.url}
                                                </span>
                                            </div>

                                            <div className="link-actions">
                                                <button
                                                    onClick={() =>
                                                        openEditLink(link)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteLink(link.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {linkModalOpen && (
                                <div className="link-modal-overlay">
                                    <div className="link-modal">
                                        <div className="link-modal-header">
                                            <div>
                                                <span className="eyebrow">
                                                    Links
                                                </span>

                                                <h2>
                                                    {editingLink
                                                        ? "Edit link"
                                                        : "Add link"}
                                                </h2>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setLinkModalOpen(false)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="form-group">
                                            <label>Title</label>

                                            <input
                                                type="text"
                                                value={linkForm.title}
                                                placeholder="GitHub"
                                                onChange={(e) =>
                                                    setLinkForm((prev) => ({
                                                        ...prev,
                                                        title: e.target.value
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>URL</label>

                                            <input
                                                type="url"
                                                value={linkForm.url}
                                                placeholder="https://github.com/username"
                                                onChange={(e) =>
                                                    setLinkForm((prev) => ({
                                                        ...prev,
                                                        url: e.target.value
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Icon</label>

                                            <div className="icon-picker">
                                                {Object.entries(LINK_ICONS).map(
                                                    ([name, icon]) => (
                                                        <button
                                                            key={name}
                                                            type="button"
                                                            className={`icon-option ${
                                                                linkForm.icon ===
                                                                name
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                setLinkForm(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        icon: name
                                                                    })
                                                                )
                                                            }
                                                            title={name}
                                                        >
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    d={icon.path}
                                                                />
                                                            </svg>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="link-modal-footer">
                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    setLinkModalOpen(false)
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="save-link-button"
                                                onClick={saveLink}
                                            >
                                                {editingLink
                                                    ? "Save changes"
                                                    : "Add Link"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

  {activeTab === "music" && (
    <div className="dashboard-section">
        <div className="section-heading">
            <div>
                <span className="eyebrow">
                    Music
                </span>

                <h1>Music Player</h1>

                <p>
                    Customize the music on your profile.
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
                    <label>Audio file</label>

                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                uploadImage(file, "music");
                            }

                            e.target.value = "";
                        }}
                    />

                    {profile.musicUrl && (
                        <span className="field-hint">
                            Audio file uploaded successfully.
                        </span>
                    )}
                </div>


                <div className="form-group">
                    <label htmlFor="music-title">
                        Track title
                    </label>

                    <input
                        id="music-title"
                        type="text"
                        maxLength={30}
                        value={profile.musicTitle}
                        onChange={(e) =>
                            updateProfile(
                                "musicTitle",
                                e.target.value
                            )
                        }
                        placeholder="Enter track title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="music-artist">
                        Artist
                    </label>

                    <input
                        id="music-artist"
                        type="text"
                        maxLength={30}
                        value={profile.musicArtist}
                        onChange={(e) =>
                            updateProfile(
                                "musicArtist",
                                e.target.value
                            )
                        }
                        placeholder="Enter artist name"
                    />
                </div>

                <div className="editor-footer">
                    <span>{message}</span>

                    <button
                        type="button"
                        onClick={saveProfile}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>
        )}
    </div>
)}

                    {activeTab === "settings" && (
                        <div className="empty-section">
                            <span className="eyebrow">Settings</span>

                            <h1>Account settings</h1>

                            <p>
                                Manage your Linxy account.
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