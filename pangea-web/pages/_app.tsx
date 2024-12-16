import { css, Global } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LicenseInfo } from '@mui/x-license-pro';
import { Layout } from 'components/global';
import { FeatureFlagProvider } from 'components/shared/FeatureFlag';
import featureFlags from 'featureFlags.json';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { customTheme, PangeaColors } from 'styles';
import '../styles/globals.css';
import '../styles/spinner.scss';

// const DebugObserver = () => {
//   const snapshot = useRecoilSnapshot();
//   useEffect(() => {
//     let changedNodes = {};
//     for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
//       changedNodes = {
//         ...changedNodes,
//         [node.key]: snapshot.getLoadable(node),
//       };
//     }
//     if (Object.keys(changedNodes).length > 0) {
//       console.debug('The following atoms were modified:', changedNodes);
//     }
//   }, [snapshot]);

//   return null;
// };

// MUI License
const lic = process.env.NEXT_PUBLIC_MUI_LICENSE;
lic
  ? LicenseInfo.setLicenseKey(lic)
  : console.warn('MUI License not detected.');

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <RecoilRoot>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={queryClient}>
          <FeatureFlagProvider
            features={featureFlags}
            enableDevTool={
              process.env.NEXT_PUBLIC_ENABLE_FEATURE_FLAG_DEVTOOL === 'true'
            }
          >
            {Component['name'] == 'LeavingPangea' ? (
              <ThemeProvider theme={customTheme}>
                <Global
                  styles={css(`
              body{
                background-color: ${PangeaColors.StoryWhiteMedium};
                margin: 0
              },
              html {
                position: relative;
                min-height: 100vh;
              }`)}
                />
                <Component {...pageProps} />
              </ThemeProvider>
            ) : (
              <ThemeProvider theme={customTheme}>
                <Layout>
                  <Global
                    styles={css(`
              body{
                background-color: ${PangeaColors.StoryWhiteMedium};
                margin: 0
              },
              html {
                position: relative;
                min-height: 100vh;
              }`)}
                  />
                  <Component {...pageProps} />
                </Layout>
              </ThemeProvider>
            )}
          </FeatureFlagProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </RecoilRoot>
  );
}

export default MyApp;
