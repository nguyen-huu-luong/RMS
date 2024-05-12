import axios, { Axios, AxiosError } from "axios";
import type { AuthOptions, Awaitable, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { POST } from "./route";

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                console.log("authorized");
                try {
                    const response = await axios({
                        url: `${backend_api}/users/signin`,
                        method: "POST",
                        data: {
                            email: credentials?.email,
                            password: credentials?.password,
                        },
                    });

                    const { accessToken: accessToken, user } = response.data;
                    if (user) {
                        return { ...user, accessToken } as unknown as Awaitable<User>;
                    }
                } catch (error: any) {
                    console.log(error.response.data);
                    throw new Error(JSON.stringify(error?.response?.data || error));
                }
                return null;
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                let parseProfile = JSON.parse(JSON.stringify(profile))
                const { given_name, family_name, picture, email } = parseProfile
                try {
                    const result = await axios({
                        method: "POST",
                        data: {
                            firstname: family_name,
                            lastname: given_name,
                            avatar: picture,
                            email
                        }
                    })

                    if (result) {
                        const { accessToken: accessToken, user } = result.data;
                        
                    }
                } catch (error) {

                }
                console.log(
                    parseProfile,
                    parseProfile.email_verified
                );
                return true;
            }
            return true;
        },
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
