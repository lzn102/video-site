import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { PointsProvider } from '../contexts/PointsContext';
import { AuthProvider } from '../contexts/AuthContext';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4014645721862127"
          crossOrigin="anonymous"></script>
      </Head>
      <LanguageProvider>
        <AuthProvider>
          <PointsProvider>
            <Component {...pageProps} />
          </PointsProvider>
        </AuthProvider>
      </LanguageProvider>
    </>
  );
}

export default MyApp;