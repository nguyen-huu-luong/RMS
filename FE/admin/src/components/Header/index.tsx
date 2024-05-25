import { getCurrentUser } from "@/lib/session";
import HeaderContainer from "./Header";
import { redirect } from "next/navigation";

export default async function Header() {
    const user = await getCurrentUser() 
    if (!user) redirect("/signin"); 

    return <HeaderContainer user={user} />
}