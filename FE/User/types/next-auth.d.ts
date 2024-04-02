import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      accessToken: string;
      phone: string;
      firstname: string;
      lastname: string;
      birthday: string;
      avatar: string;
      gender: boolean;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}
