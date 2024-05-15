import axios, { Axios, AxiosError } from "axios";
import { getServerSession, type AuthOptions, type Awaitable, type User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { POST } from "./route";
import { userAgent } from "next/server";
import { getSession } from "next-auth/react";

const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
              }
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
                        url: `http://${process.env.NEXT_PUBLIC_BACKEND_NAME}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/users/signin`,
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
                    console.log(error)
                    console.log(error.response.data);
                    throw new Error(JSON.stringify(error?.response?.data || error));
                }
                return null;
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                let parseProfile = JSON.parse(JSON.stringify(profile))
                const { given_name, family_name, picture, email } = parseProfile
                // console.log(parseProfile)
                try {
                    const result = await axios({
                        method: "POST",
                        url: `${backend_api}/users/signup`,
                        data: {
                            firstname: family_name,
                            lastname: given_name,
                            avatar: picture,
                            email,
                            password: "default",
                            isGoogleAccount: true
                        }
                    })   
                    
                    // account.access_token = result.data.accessToken
                    // account.userId = result.data.user.id
                    user.id = result.data.user.id
                    user.name='google'
                    user.image=JSON.stringify({...result.data.user, accessToken: result.data.accessToken})

                    // user.id = result.data.user.id
                    // profile = result.data.user
                    // if (profile) {
                    //     user = profile
                    // }
                    // console.log(result.data)
                    // console.log("New user", user)

                    
                    
                } catch (error) {
                    console.log(error)
                    return false
                }
            }
            return true;
        },
        async session({ session, token }) {
            console.log("SESSION")
            console.log(session, token)
            console.log("===================")
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
        async jwt({ token, user, account, profile }) {
            console.log("JWT")
            console.log(token)
            console.log("===================")
            
            if (!token.accessToken && token.name === 'google') {
                let googleUser = JSON.parse(token.picture || token.image as string)
                console.log(googleUser)

                token = {...googleUser, iat: token.iat, exp: token.exp,jti: token.jti}
            }
            if (typeof user !== "undefined") {
                // user has just signed in so the user object is populate   d
                return user as unknown as JWT;
            }


            console.log(user)

            return token;
        },
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
