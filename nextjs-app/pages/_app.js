import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { PointsProvider } from '../contexts/PointsContext';

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <PointsProvider>
        <Component {...pageProps} />
      </PointsProvider>
    </LanguageProvider>
  );
}

export default MyApp;