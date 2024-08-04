// app/ProviderWrapper.tsx
'use client';

import { ReactNode } from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignOutButton } from "@clerk/nextjs";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Navbar from "@/components/Navbar";

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <SignedOut>
          <div className="flex justify-center items-center text-center mt-16">
            <SignIn routing="hash" />
          </div>
        </SignedOut>
        <SignedIn>
          <main className="max-w-10xl mx-auto">
            <Navbar />
            {children}
          </main>
        </SignedIn>
      </Provider>
    </ClerkProvider>
  );
};

export default ProviderWrapper;
