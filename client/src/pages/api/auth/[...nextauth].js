import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import jwt from "jsonwebtoken";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "line-up",
      async authorize(credentials, req) {
        const payload = {
          secret: credentials.secret,
          email: credentials.email,
          password: credentials.password,
        };
        try {
          const res = await axios.post(
            "https://line-up-back.onrender.com/api/user/login",
            payload,
            { withCredentials: true, credentials: "include" }
          );

          const user = res.data;
          return user;
        } catch (error) {
          return;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],
  basePath: "https://web-app-line-up1.vercel.app",
  secret: process.env.SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.SECRET,
    signingKey: process.env.SECRET,
    encryption: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      const isUserSignedIn = user ? true : false;
      if (isUserSignedIn) {
        const dataToken = jwt.sign(user, process.env.SECRET, {
          expiresIn: "2d",
        });
        token.accessToken = dataToken;
        token.role = { admin: user.admin, operator: user.operator };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.accessToken;
      session.role = token.role;
      return session;
    },
  },
});
