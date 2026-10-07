import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const profile = await prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        });

        if (!profile) {
            return NextResponse.json({
                links: []
            });
        }

        const links = await prisma.profileLink.findMany({
            where: {
                profileId: profile.id
            },
            orderBy: {
                position: "asc"
            }
        });

        return NextResponse.json({
            links
        });

    } catch (error) {
        console.error("LINKS_GET_ERROR:", error);

        return NextResponse.json(
            {
                error: error?.message || "Failed to load links"
            },
            { status: 500 }
        );
    }
}


export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const title = body?.title?.trim();
        const url = body?.url?.trim();
        const icon = body?.icon?.trim();

        if (!title || !url || !icon) {
            return NextResponse.json(
                {
                    error: "Title, URL and icon are required"
                },
                { status: 400 }
            );
        }

        const profile = await prisma.profile.upsert({
            where: {
                userId: user.id
            },
            update: {},
            create: {
                userId: user.id
            }
        });

        const lastLink = await prisma.profileLink.findFirst({
            where: {
                profileId: profile.id
            },
            orderBy: {
                position: "desc"
            }
        });

        const position = lastLink
            ? lastLink.position + 1
            : 0;

        const link = await prisma.profileLink.create({
            data: {
                profileId: profile.id,
                title,
                url,
                icon,
                position
            }
        });

        return NextResponse.json({
            link
        });

    } catch (error) {
        console.error("LINKS_POST_ERROR:", error);

        return NextResponse.json(
            {
                error: error?.message || "Failed to create link"
            },
            { status: 500 }
        );
    }
}


export async function PUT(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const id = body?.id?.trim();
        const title = body?.title?.trim();
        const url = body?.url?.trim();
        const icon = body?.icon?.trim();

        if (!id || !title || !url || !icon) {
            return NextResponse.json(
                {
                    error: "ID, title, URL and icon are required"
                },
                { status: 400 }
            );
        }

        const profile = await prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        });

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        const existingLink = await prisma.profileLink.findFirst({
            where: {
                id,
                profileId: profile.id
            }
        });

        if (!existingLink) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        const link = await prisma.profileLink.update({
            where: {
                id
            },
            data: {
                title,
                url,
                icon
            }
        });

        return NextResponse.json({
            link
        });

    } catch (error) {
        console.error("LINKS_PUT_ERROR:", error);

        return NextResponse.json(
            {
                error: error?.message || "Failed to update link"
            },
            { status: 500 }
        );
    }
}


export async function DELETE(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const id = body?.id?.trim();

        if (!id) {
            return NextResponse.json(
                { error: "Link ID is required" },
                { status: 400 }
            );
        }

        const profile = await prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        });

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        const existingLink = await prisma.profileLink.findFirst({
            where: {
                id,
                profileId: profile.id
            }
        });

        if (!existingLink) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        await prisma.profileLink.delete({
            where: {
                id
            }
        });

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error("LINKS_DELETE_ERROR:", error);

        return NextResponse.json(
            {
                error: error?.message || "Failed to delete link"
            },
            { status: 500 }
        );
    }
}