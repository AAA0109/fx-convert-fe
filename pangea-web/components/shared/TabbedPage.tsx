import { Box, Tab, Tabs } from '@mui/material';
import { hideDashboardState } from 'atoms';
import { useRouter } from 'next/router';
import { ComponentType, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { GridLayoutOneTenOne } from './GridLayoutOneTenOne';
import { PangeaPageTitle as PageTitle } from './PangeaPageTitle';
import { TabPanel, a11yProps } from './TabPanel';

export const TabbedPage = (props: {
  pageTitle: string;
  pageRoute: string;
  tabs: {
    label: string;
    dataRoute: string;
    component: ComponentType<any>;
    testId?: string;
  }[];
  container?: any;
  containerProps?: object;
}) => {
  // Page routing config
  const { pageTitle, pageRoute, tabs, container, containerProps } = props;
  const tabRoutes = useMemo(() => tabs.map((e) => e.dataRoute), [tabs]);
  // Deep linking router config
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [subTabPart, setSubTabPart] = useState('');
  const TabContainer = container ?? GridLayoutOneTenOne;
  const showDashboard = useRecoilValue(hideDashboardState);

  useEffect(() => {
    const pathParts = router.asPath.split('/');
    const tabPart = pathParts.length > 2 ? pathParts[2].toLowerCase() : '';
    setSubTabPart(pathParts.length > 3 ? pathParts[3].toLowerCase() : '');
    const tabValueFromRoute = Math.max(
      0,
      tabPart.length > 0 ? tabRoutes.findIndex((e) => e === tabPart) : 0,
    );
    setValue(tabValueFromRoute);
  }, [setSubTabPart, tabRoutes, setValue, router]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const newSubpath =
      event.currentTarget.attributes.getNamedItem('data-router')?.value;
    router.push(pageRoute + newSubpath, pageRoute + newSubpath);
    setValue(newValue);
  };
  return (
    <TabContainer {...containerProps}>
      {!showDashboard ? (
        <PageTitle
          title={pageTitle}
          color={PangeaColors.BlackSemiTransparent87}
        />
      ) : null}

      <Box sx={{ width: '100%' }}>
        {!showDashboard ? (
          <Box
            sx={{
              borderBottom: 1,
              borderColor: PangeaColors.BlackSemiTransparent60,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='tabbed content'
              sx={{
                '& .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary': {
                  color: PangeaColors.PrimaryMain,
                },
                '& .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.Mui-selected':
                  {
                    color: PangeaColors.BlackSemiTransparent87,
                  },
              }}
            >
              {tabs.map((e, i) => (
                <Tab
                  data-testid={e.testId}
                  data-router={e.dataRoute}
                  label={e.label}
                  key={i}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
          </Box>
        ) : null}

        {tabs.map((e, i) => (
          <TabPanel value={value} index={i} key={i}>
            {subTabPart ? (
              <e.component selectedTab={subTabPart} />
            ) : (
              <e.component />
            )}
          </TabPanel>
        ))}
      </Box>
    </TabContainer>
  );
};
export default TabbedPage;
