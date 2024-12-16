import BugReportIcon from '@mui/icons-material/BugReport';
import { Container, Fab } from '@mui/material';
import Head from 'next/head';
import Script from 'next/script';
import { ReactNode, Suspense } from 'react';
import { useRecoilCallback } from 'recoil';
import { customThemeData } from 'styles';
import { PangeaAlertNotification } from '../shared';
import { AuthManager } from './AuthManager';
import { Footer } from './Footer';
import { MarkerFeedback } from './MarkerFeedback';
import { NewRelicScript } from './NewRelicScript';
import { PangeaAppBar as AppBar } from './PangeaAppBar';
interface Props {
  children: ReactNode;
}
const GTM_ID = process.env.GTM_ID;
function DebugButton() {
  const onClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        console.debug('Atom values:');
        for (const node of snapshot.getNodes_UNSTABLE()) {
          try {
            const value = await snapshot.getPromise(node);
            console.log(node.key, value);
          } catch (e) {
            console.error(e);
          }
        }
      },
    [],
  );
  return (
    <Fab color='primary' aria-label='debug' onClick={onClick}>
      <BugReportIcon />
    </Fab>
  );
}
export const Layout = ({ children }: Props) => {
  return (
    <>
      <Script id='google-tag-manager' strategy='afterInteractive'>
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <Head>
        <link rel='icon' href='/images/favico.svg' />
      </Head>
      <MarkerFeedback />
      <NewRelicScript />
      <AuthManager />
      <Suspense>
        <AppBar />
        <Container
          sx={{
            marginBottom: '8rem',
            paddingTop: '24px',
            paddingBottom: '45px',
            maxWidth: customThemeData.columnWidths.desktop,
            minWidth: customThemeData.columnWidths.desktop,
            ['@media (min-width: 0px)']: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          <main>{children}</main>
        </Container>
        <PangeaAlertNotification />
        {process.env.NODE_ENV == 'development' ? <DebugButton /> : null}
        <Footer />
      </Suspense>
    </>
  );
};
export default Layout;
