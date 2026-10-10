
"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export default function ProfileViews({ initialViews = 0 }) {
    const [views, setViews] = useState(initialViews);

    useEffect(() => {
        function handleViewsUpdated(event) {
            setViews(event.detail.views);
        }

        window.addEventListener(
            "linxy:views-updated",
            handleViewsUpdated
        );

        return () => {
            window.removeEventListener(
                "linxy:views-updated",
                handleViewsUpdated
            );
        };
    }, []);

    return (
        <div className="profile-views">
            <Eye size={15} />
            <span>{views}</span>
        </div>
    );
}
