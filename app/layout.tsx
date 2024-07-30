

import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignOutButton } from "@clerk/nextjs";

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

const inter = Inter({ subsets: ["latin"] });
const space_Grotesk = Space_Grotesk({ subsets: ["latin"], weight: ['300','400','500','600','700'] });


export const metadata: Metadata = {
  title: "Pricewise",
  description: "Track product prices effortlessly and save money on your online shopping",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
     
         <ClerkProvider>
        { /* <ConvexProviderWithClerk client={convex} useAuth={useAuth}> */}
        <SignedOut>
          <div className="flex justify-center items-center text-center mt-16">
          <SignIn routing="hash"/>
          </div>
        </SignedOut>
         <SignedIn>
            <main className="max-w-10xl mx-auto">
               <Navbar />
              {children}
            </main>
            <SignOutButton/>
            </SignedIn>
            
         { /* </ConvexProviderWithClerk>*/}
        </ClerkProvider> 
      </body>
    </html>
  );
}
