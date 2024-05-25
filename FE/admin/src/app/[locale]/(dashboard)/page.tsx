import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default async function Index() {
    const user = await getCurrentUser();

    if (!user) redirect("/signin"); 

    console.log(user)

    if (user.role && user.role === "chef") {
        redirect("/chef");
    } else if (
        user.role === "manager" ||
        user.role === "employee"
    ) {
        redirect("/overview");
    }
    return <></>;
}
