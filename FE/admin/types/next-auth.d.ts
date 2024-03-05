import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

export enum Role {
  manager = "manager",
  employee = "employee",
  chef = "chef"
}
interface IUser extends DefaultUser {
  role?: Role;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User extends IUser {}
  interface Session {
    // user: {
    //   username: string;
    //   accessToken: string;
    //   role: string;
    // } & DefaultSession["user"];
    user?: User
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}