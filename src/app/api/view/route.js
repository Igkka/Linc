
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { username } = await request.json();

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                profile: {
                    select: { id: true }
                }
            }
        });

        if (!user?.profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        const profile = await prisma.profile.update({
            where: { id: user.profile.id },
            data: {
                views: { increment: 1 }
            },
            select: { views: true }
        });

        return NextResponse.json({
            success: true,
            views: profile.views
        });
    } catch (error) {
        console.error("PROFILE_VIEW_ERROR:", error);

        return NextResponse.json(
            { error: "Failed to count view" },
            { status: 500 }
        );
    }
}
