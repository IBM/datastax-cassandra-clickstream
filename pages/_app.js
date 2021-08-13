import AppHeader from '../components/AppHeader';
import { Provider as NextAuthProvider } from 'next-auth/client'
import { Provider as ReduxProvider } from 'react-redux';
import store from '../redux/store';

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store} >
      <div>
        <NextAuthProvider
         options={{
          clientMaxAge: 0,
          keepAlive: 0,
        }}
        session={pageProps.session}
       >
          <AppHeader />
          <Component {...pageProps} />
        </NextAuthProvider>
      </div>
    </ReduxProvider>
  );
}

export default MyApp
