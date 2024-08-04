'use client'
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ClerkProvider } from '@clerk/nextjs';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ClerkProvider>
  );
}

export default MyApp;
