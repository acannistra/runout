import 'runout/styles/globals.css'
import { Inter } from '@next/font/google';
import { AppStateWrapper } from 'runout/context/state';

const inter = Inter({ subsets: ['latin'] })


export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <AppStateWrapper>
        <Component {...pageProps} />
      </AppStateWrapper>
    </>
  );
}
