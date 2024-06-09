import { getCurrentUser } from "@/lib/session";
import HeaderContainer from "./Header";
import { redirect } from "next/navigation";
import variables from "@/app/variables.module.scss";


export default async function Header() {
    const user = await getCurrentUser()
    if (!user) redirect("/signin");

    return (<div
        className="flex items-center justify-between bg-white py-2 px-10 space-x-2 border-b-2 fixed z-50 top-0 right-0 h-header"
        style={{ width: `calc(100% - ${variables.sidebarWidth}` }}
    >
        <HeaderContainer user={user} />
    </div>)
}