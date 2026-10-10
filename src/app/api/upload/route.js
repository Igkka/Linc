
import { NextResponse } from "next/server";
import { parseBuffer } from "music-metadata";
import { getCurrentUser } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";

function uploadToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(options, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
            .end(buffer);
    });
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

        const formData = await request.formData();
        const file = formData.get("file");
        const type = formData.get("type");

        if (!file || typeof file === "string") {
            return NextResponse.json(
                { error: "File is required" },
                { status: 400 }
            );
        }

        if (!["avatar", "background", "music"].includes(type)) {
            return NextResponse.json(
                { error: "Invalid upload type" },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/webm",
            "audio/mpeg",
            "audio/mp4",
            "audio/aac",
            "audio/ogg",
            "audio/wav",
            "audio/webm"
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Unsupported file type" },
                { status: 400 }
            );
        }

        const isVideo = file.type.startsWith("video/");
        const isAudio = file.type.startsWith("audio/");
        const isImage = file.type.startsWith("image/");

        if (
            (type === "avatar" && !isImage) ||
            (type === "background" && !isImage && !isVideo) ||
            (type === "music" && !isAudio)
        ) {
            return NextResponse.json(
                { error: "File type does not match upload type" },
                { status: 400 }
            );
        }

        const maxSize =
            type === "avatar"
                ? 5 * 1024 * 1024
                : type === "music"
                    ? 20 * 1024 * 1024
                    : isVideo
                        ? 30 * 1024 * 1024
                        : 10 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    error:
                        type === "avatar"
                            ? "Avatar must be smaller than 5MB"
                            : type === "music"
                                ? "Music file must be smaller than 20MB"
                                : isVideo
                                    ? "Background video must be smaller than 30MB"
                                    : "Background image must be smaller than 10MB"
                },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const folder =
            type === "avatar"
                ? "linc/avatars"
                : type === "music"
                    ? "linc/music"
                    : "linc/backgrounds";

        // Upload the main file.
        const result = await uploadToCloudinary(buffer, {
            folder,
            resource_type: isVideo || isAudio ? "video" : "image"
        });

        let coverUrl = null;

        // Extract and upload the embedded track cover.
        if (type === "music") {
            try {
                const metadata = await parseBuffer(
                    buffer,
                    file.type
                );

                const picture = metadata.common.picture?.[0];

                if (picture) {
                    const coverResult = await uploadToCloudinary(
                        Buffer.from(picture.data),
                        {
                            folder: "linc/music-covers",
                            resource_type: "image"
                        }
                    );

                    coverUrl = coverResult.secure_url;
                }
            } catch (error) {
                // Keep the audio upload successful even if
                // its embedded cover cannot be extracted.
                console.error("MUSIC_COVER_ERROR:", error);
            }
        }

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
            coverUrl
        });
    } catch (error) {
        console.error("UPLOAD_ERROR:", error);

        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
