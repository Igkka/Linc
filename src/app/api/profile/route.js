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

        return NextResponse.json({
            profile
        });
    } catch (error) {
        console.error("PROFILE_GET_ERROR:", error);

        return NextResponse.json(
            { error: "Something went wrong" },
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

        const {
            description,
            avatar,
            background,
            font,
            textColor,
            descriptionColor,
            iconColor
        } = body;

        const profile = await prisma.profile.upsert({
            where: {
                userId: user.id
            },

            update: {
                description,
                avatar,
                background,
                font,
                textColor,
                descriptionColor,
                iconColor
            },

            create: {
                userId: user.id,
                description,
                avatar,
                background,
                font,
                textColor,
                descriptionColor,
                iconColor
            }
        });

        return NextResponse.json({
            profile
        });
    } catch (error) {
        console.error("PROFILE_UPDATE_ERROR:", error);

        return NextResponse.json(
            {
                error: error.message || "Something went wrong"
            },
            { status: 500 }
        );
    }
}