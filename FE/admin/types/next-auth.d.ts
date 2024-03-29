// import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// export enum Role {
//   manager = "manager",
//   employee = "employee",
//   chef = "chef"
// }
// interface IUser extends DefaultUser {
//   role?: Role;
// }

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface User extends IUser {}
//   interface Session {
//     // user: {
//     //   username: string;
//     //   accessToken: string;
//     //   role: string;
//     // } & DefaultSession["user"];
//     user?: User
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT extends IUser {}
// }
import NextAuth, { DefaultSession } from "next-auth";

import "next-auth";
import type { User } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
    accessToken?: string;
  }

  interface User {
    username: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User {
    accessToken: string;
    accessTokenExpires: number;
  }
}