import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        email: { label: "Email", type: "email" },
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          // User did not enter email or password.
          throw new Error("Data nor provided");
        }

        console.log({ credentials });

        return {
          id: credentials.id.toString(),
          email: credentials.email,
          username: credentials.username,
          image_url: "",
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub; // token.uid or token.sub both work
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id; // token.uid or token.sub both work
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Handles all other auth routes.
export default NextAuth(authOptions);
