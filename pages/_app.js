import '@/styles/globals.css'
import { AuthUserProvider } from '@/lib/AuthUserContext';

export default function App({ Component, pageProps }) {
  return <AuthUserProvider><Component {...pageProps} /></AuthUserProvider>
}
