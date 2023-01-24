import 'runout/styles/globals.css'
import { AppStateWrapper } from 'runout/context/state';

export default function App({ Component, pageProps }) {
  return (
    <AppStateWrapper>
      <Component {...pageProps} />
    </AppStateWrapper>
  );
}
