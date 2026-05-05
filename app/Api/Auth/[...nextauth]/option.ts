import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text"},
        password: { label: "Password", type: "password" },
      },
       async authorize(credentials, req)
    }),
  ],
};

export default NextAuth(authOptions);
