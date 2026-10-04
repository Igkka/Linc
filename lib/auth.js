import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET
);

export async function getCurrentUser() {

    try {

        const cookieStore = await cookies();

        const token = cookieStore.get("linc_session")?.value;

        if (!token) {
            return null;
        }

        const { payload } = await jwtVerify(
            token,
            secret
        );

        return {
            id: payload.userId,
            username: payload.username
        };

    } catch {

        return null;

    }
}