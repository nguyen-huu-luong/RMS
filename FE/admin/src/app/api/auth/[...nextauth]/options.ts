import fetchClient from "@/lib/fetch-client";
import { jwt } from "@/lib/jwt";
import axios, { Axios, AxiosError } from "axios";
import type { AuthOptions, Awaitable, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await fetchClient({
                        url: `/users/admin/signin`,
                        method: "POST",
                        body: {
                            username: credentials?.username,
                            password: credentials?.password,
                        },
                    });

                    console.log(response.data)

                    const data: { accessToken: string; user: User } = response.data;

                    if (!data.accessToken || !data.user) {
                        throw response;
                    }

                    return {
                        ...data.user,
                        accessToken: data.accessToken,
                    };
                } catch (error: any) {
                    console.log("Something wrong!", error)
                    if (error instanceof Response) {
                        return null;
                    }
                    throw new Error(JSON.stringify(error?.response?.data || error));
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            if (token.error) {
                throw new Error("Refresh token has expired");
            }
            session.accessToken = token.accessToken;
            session.user.username = token.username || "";
            session.user.role = token.role || ""; 

            console.log(session)
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update") {
                return { ...token, ...session };
            }

            if (user) {
                return { ...token, ...user };
            }
        
            const { exp: accessTokenExpires } = jwt.decode(token.accessToken);
    
            if (!accessTokenExpires) {
                return token;
            }
    
            const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    
            if (currentUnixTimestamp > accessTokenExpires) {
                return await refreshAccessToken(token);
            }
        
            return token;

        },
       
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

async function refreshAccessToken(token: JWT) {
    try {
        const response = await axios({
            url: `${process.env.NEXT_BACKEND_API_URL}/user/refresh`,
            method: "POST",
        });

        const refreshedAccessToken: { accessToken: string } = response.data;
        const { exp } = jwt.decode(refreshedAccessToken.accessToken);

        return {
            ...token,
            accessToken: refreshedAccessToken.accessToken,
            exp,
        };
    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}
