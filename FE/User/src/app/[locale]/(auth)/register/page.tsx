import React from "react";
import { LoginForm } from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import RegistrationForm from "@/components/RegisterForm";
// import { useLocale } from "next-intl";
// import { useRouter } from "next/navigation";

const Register: React.FC = async () => {
    // const router = useRouter()
    // const locale = useLocale()
    const session = await getServerSession(authOptions) ;
    if (session) {
        redirect(`/${"en"}/profile`);
    }
    return (
        <main className="flex items-center justify-center w-full space-x-6">
            <div className="hidden w-3/5 max-h-screen overflow-hidden md:flex items-center justify-center">
                <img alt="" src="/Login/food2.svg" width={"100%"} />
            </div>
            <div className="h-[600px] rounded-lg w-full md:w-2/5 flex items-center justify-center">
              <RegistrationForm />
            </div>
        </main>
    );
};

export default Register;
