"use client";

import { useState } from "react";
import Link from "next/link";
import "@/components/reg.css";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            window.location.href = "/";

        } catch {
            setError("Unable to connect to the server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-box">

                <h1>Create your Linc</h1>

                <p className="auth-description">
                    Create your personal space on the internet.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Username</label>

                    <input
                        type="text"
                        placeholder="yourname"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create account"}
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link href="/login">
                        Log in
                    </Link>
                </p>

            </div>
        </main>
    );
}