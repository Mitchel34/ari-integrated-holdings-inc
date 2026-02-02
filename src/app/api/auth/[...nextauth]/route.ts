import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin@ari.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Mock authentication for demonstration
                // In a real app, you would check against a database here.
                if (
                    credentials?.username === "admin@ari.com" &&
                    credentials?.password === "admin"
                ) {
                    const user = { id: "1", name: "Admin Exec", email: "admin@ari.com", role: "executive" };
                    return user;
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    }
});

export { handler as GET, handler as POST };
