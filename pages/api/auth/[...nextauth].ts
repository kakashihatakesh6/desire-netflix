import NextAuth, { AuthOptions, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "@/lib/prismadb";
import { compare } from "bcrypt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { JWT } from "next-auth/jwt";

interface ExtendedUser extends Omit<User, 'id'> {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  hashedPassword?: string | null;
  favoriteIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
interface ExtendedSession extends Session {
  user?: ExtendedUser;
}

interface ExtendedToken extends JWT {
  sub: string;
}

export default NextAuth({
  // export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password required");
        }

        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist");
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect Password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }): Promise<ExtendedToken> {
      if (user) {
        // Update token on sign in
        return {
          ...token,
          sub: user.id,
        };
      }
      return token as ExtendedToken;
    },
    async session({ token, session }): Promise<ExtendedSession> {
      if (session.user && token.sub) {
        const user = await prismadb.user.findUnique({
          where: { id: token.sub }
        });

        if (!user) {
          throw new Error("User not found");
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
            favoriteIds: user.favoriteIds,
          },
        };
      }
      return session as ExtendedSession;
    },
  },
  // // Add secure cookies in production .
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
// }

// export default NextAuth(authOptins);
