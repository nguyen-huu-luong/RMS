import React from "react";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import {} from 'next-intl/server';

const SignIn: React.FC = async () => {
    const session = await getServerSession(authOptions) ;
    if (session) {
        console.log(session)
        // redirect(`/`);
    }

    return (
        <main className="flex items-center justify-center w-full space-x-6">
            <div className="h-[600px] rounded-lg w-full md:w-2/5 flex items-center justify-center">
              <LoginForm />
            </div>
        </main>
    );
};

export default SignIn;

