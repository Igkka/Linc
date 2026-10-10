
import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import "./user.css";
import MusicPlayer from "./MusicPlayer";
import ProfileEntry from "./ProfileEntry";
import ProfileViews from "./ProfileViews";

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

const linkIcons = {
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

function LinkIcon({ name }) {
    const icon = linkIcons[name];

    if (!icon) {
        return <span className="default-link-icon">↗</span>;
    }

    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="user-social-icon"
            fill="currentColor"
        >
            <path d={icon.path} />
        </svg>
    );
}

export default async function UserPage({ params }) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            uid: true,
            username: true,
            profile: {
                include: {
                    links: {
                        orderBy: {
                            position: "asc"
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        notFound();
    }

    const profile = user.profile;

    return (
        <ProfileEntry username={user.username}>
        <main
            className="user-page"
            style={{
                color: profile?.textColor || "#ffffff",
                fontFamily: profile?.font || "Manrope"
            }}
        >
            {profile?.backgroundType === "video" ? (
                <video
                    className="user-background-video"
                    src={profile.background}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            ) : profile?.background ? (
                <div
                    className="user-background-image"
                    style={{
                        backgroundImage: `url(${profile.background})`
                    }}
                />
            ) : null}

            <div className="user-content">
                <MusicPlayer
                    musicUrl={profile?.musicUrl}
                    title={profile?.musicTitle}
                    artist={profile?.musicArtist}
                    cover={profile?.musicCover}
                />

                <div className="user-profile">
                    <div className="user-avatar">
                        {profile?.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={user.username}
                            />
                        ) : (
                            user.username.charAt(0).toUpperCase()
                        )}
                    </div>

                    <h1
                        style={{
                            color: profile?.textColor || "#ffffff"
                        }}
                    >
                        {user.username}
                    </h1>

                    <strong className="uid">
                        UID #{user.uid}
                    </strong>

                    {profile?.description && (
                        <p
                            style={{
                                color: profile?.descriptionColor || "#ffffff"
                            }}
                        >
                            {profile.description}
                        </p>
                    )}

                    {profile?.links?.length > 0 && (
                        <div className="user-links">
                            {profile.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="user-link"
                                    style={{
                                        color: profile?.iconColor || "#ffffff"
                                    }}
                                    aria-label={link.title || link.icon}
                                    title={link.title || link.icon}
                                >
                                    <span className="user-link-icon">
                                        <LinkIcon name={link.icon} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    )}
                    <ProfileViews initialViews={profile?.views ?? 0} />
                </div>
            </div>
        </main>
        </ProfileEntry>
    );
}
