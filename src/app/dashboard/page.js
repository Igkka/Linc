import { getCurrentUser } from "../../../lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "../../components/DashboardClient";

export default async function Dashboard() {

    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return <DashboardClient user={user} />;
}