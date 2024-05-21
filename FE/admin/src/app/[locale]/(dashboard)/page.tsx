import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default async function Index() {
    // const session = await getSession();

    // if (!session) redirect("/signin");

    // if (session.user?.role && session.user?.role === "chef") {
    //     redirect("/chef");
    // } else if (
    //     session.user?.role === "manager" ||
    //     session.user?.role === "employee"
    // ) {
    //     redirect("/overview");
    // }
    return <></>;
}
