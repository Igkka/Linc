import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";

export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const type = formData.get("type");

        if (!file || typeof file === "string") {
            return NextResponse.json(
                { error: "File is required" },
                { status: 400 }
            );
        }

        if (!["avatar", "background"].includes(type)) {
            return NextResponse.json(
                { error: "Invalid upload type" },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    error: "Only JPG, PNG and WebP images are allowed"
                },
                { status: 400 }
            );
        }

        const maxSize =
            type === "avatar"
                ? 5 * 1024 * 1024
                : 10 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    error:
                        type === "avatar"
                            ? "Avatar must be smaller than 5MB"
                            : "Background must be smaller than 10MB"
                },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const folder =
            type === "avatar"
                ? "linc/avatars"
                : "linc/backgrounds";

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        console.error("UPLOAD_ERROR:", error);

        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}