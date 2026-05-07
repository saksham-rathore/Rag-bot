import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/app/Model/User";
import dbConnect from "@/app/lib/db.connect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              { Username: credentials.email },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.Password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
