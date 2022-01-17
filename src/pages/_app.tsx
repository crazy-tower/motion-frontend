import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'styled-components';
// Over sized icons on page refresh
// FYI: https://github.com/FortAwesome/react-fontawesome/issues/134
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import { SWRConfig } from 'swr';
import fetchJson from '../lib/fetchJson';

const defaultTheme = {
  bgGreen: '#006654',
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <ChakraProvider>
        <ThemeProvider theme={defaultTheme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </ChakraProvider>
    </SWRConfig>
  );
};

export default MyApp;
