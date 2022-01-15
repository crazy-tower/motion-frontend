import '../styles/globals.css';
import type { AppProps } from 'next/app';
// Over sized icons on page refresh
// FYI: https://github.com/FortAwesome/react-fontawesome/issues/134
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
