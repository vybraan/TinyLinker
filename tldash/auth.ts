import  NextAuth  from 'next-auth'
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const options = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "authtl",  // Custom provider for your ASP.NET Auth Service
      name: "AuthTL",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials) {
        
        const username =  credentials?.username;
        const password = credentials?.password;

        try {
          const res = await axios.post( `${process.env.AUTH_TL_BASE_URL}/api/Auth/login`, {
            username: username,
            password: password,
          }, {
            headers: {
              'Content-Type': 'application/json',
               'accept': '*/*' ,

            },
          });

          const data = res.data;
          if ("OK" === res.statusText && data.token) {
            return {
              token: data.token,
              expiresIn: data.expiration,
              username: credentials?.username
            };
          }
          // If the response is not ok, return null
          return null;
          // throw new Error(res.title, res.status);

        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, add JWT details to the token
      if (user) {
        token.accessToken = user.token;
        token.expiresIn = user.expiration;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.expiresIn = token.expiration;
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  secret: process.env.NEXTAUTH_SECRET, 
  pages: {
    signIn: "/auth/signin", // Optional custom sign-in page
    error: "/auth/error",
  },
};


export const {auth, handlers, signIn, signOut} = NextAuth(options);
