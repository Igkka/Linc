import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import "./user.css";

export default async function UserPage({ params }) {

    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
        include: {
            profile: true
        }
    });

    if (!user) {
        notFound();
    }

    const profile = user.profile;

    return (
        <main
            className="user-page"
            style={{
                backgroundImage: profile?.background
                    ? `url(${profile.background})`
                    : "none",
                color: profile?.textColor || "#ffffff",
                fontFamily: profile?.font || "Manrope"
            }}
        >

            <div className="user-profile">

                <div className="user-avatar">

                    {profile?.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={user.username}
                        />
                    ) : (
                        user.username
                            .charAt(0)
                            .toUpperCase()
                    )}

                </div>


                <h1>
                    {user.username}
                </h1>


                {profile?.description && (
                    <p>
                        {profile.description}
                    </p>
                )}

            </div>

        </main>
    );
}