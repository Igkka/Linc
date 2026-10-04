import { getCurrentUser } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import DashboardClient from "../../components/DashboardClient";

export default async function Dashboard() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: currentUser.id
        },
        select: {
            id: true,
            uid: true,
            username: true
        }
    });

    if (!user) {
        redirect("/login");
    }
    
    return <DashboardClient user={user} />;
}