
import { getCurrentUser } from '@/lib/session';
import { redirect } from "next/navigation";
export default async function Index() {
  const session = await getCurrentUser()

  if (!session) redirect("/signin")
  
  console.log("session", session)
  if (session.role && session.role === "chef") {
     redirect("/chef")
  } else if  (session.role === "manager" || session.role==="employee") {
     redirect("/overview")
  }
}