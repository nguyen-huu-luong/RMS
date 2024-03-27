import axios, { Axios, AxiosError } from "axios";
import type { AuthOptions, Awaitable, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        // GoogleProvider({
        //   clientId: process.env.GOOGLE_CLIENT_ID as string,
        //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        // }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const response = await axios({
                        url: "http://localhost:3003/api/users/admin/signin",
                        method: "POST",
                        data: {
                            username: credentials?.username,
                            password: credentials?.password,
                        },
                    });

                    const { accessToken: accessToken, user } = response.data;
                    if (user) {
                        return {
                            ...user,
                            accessToken,
                        } as unknown as Awaitable<User>;
                    }
                } catch (error: any) {
                    console.log(error.response);
                    throw new Error(
                        JSON.stringify(error?.response?.data || error)
                    );
                }
                return null;
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            const sanitizedToken = Object.keys(token).reduce((p, c) => {
                // strip unnecessary properties
                if (c !== "iat" && c !== "exp" && c !== "jti") {
                    return { ...p, [c]: token[c] };
                } else {
                    return p;
                }
            }, {});

            return { ...session, user: sanitizedToken };
        },
        async jwt({ token, user }) {
            if (typeof user !== "undefined") {
                // user has just signed in so the user object is populated
                return user as unknown as JWT;
            }

            return token;
        },
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
