import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();

        const username = body.username?.trim();
        const email = body.email?.trim().toLowerCase();
        const password = body.password;

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Fill in all fields" },
                { status: 400 }
            );
        }

        if (username.length < 3 || username.length > 20) {
            return NextResponse.json(
                { error: "Username must contain 3–20 characters" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must contain at least 8 characters" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ],
            },
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return NextResponse.json(
                    { error: "Username is already taken" },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: "Email is already registered" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
        });

        return NextResponse.json(
            {
                message: "Account created",
                user: {
                    id: user.id,
                    username: user.username,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("REGISTER_ERROR:", error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}