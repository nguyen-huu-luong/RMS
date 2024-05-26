import { getCurrentUser } from "@/lib/session";
import { SidebarContainer } from "./Sidebar";
import { redirect } from "next-intl/server";

export async function Sidebar() {
    const user = await getCurrentUser() 

    if (!user) redirect("/signin")
    
    return <SidebarContainer role={user?.role}/>
}