import { Box, Tab, Tabs } from '@mui/material';
import { ComponentType, useState } from 'react';
import { PangeaColors } from '../../styles/colors';
import GridLayoutOneTenOne from './GridLayoutOneTenOne';
import TabPanel, { a11yProps } from './TabPanel';

export const NoRouterTabbedComponent = (props: {
  tabs: {
    label: string;
    dataRoute: string;
    component: ComponentType<any>;
  }[];
  container?: any;
  containerProps?: object;
}) => {
  // Page routing config
  const { tabs, container, containerProps } = props;
  const [value, setValue] = useState(0);
  const TabContainer = container ?? GridLayoutOneTenOne;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <TabContainer {...containerProps}>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: PangeaColors.BlackSemiTransparent60,
          }}
        >
          <Tabs
            variant='fullWidth'
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
                data-router={e.dataRoute}
                label={e.label}
                key={e.label}
                {...a11yProps(i)}
              />
            ))}
          </Tabs>
        </Box>

        {tabs.map((e, i) => (
          <TabPanel value={value} index={i} key={e.label}>
            {value == i && <e.component />}
          </TabPanel>
        ))}
      </Box>
    </TabContainer>
  );
};

export default NoRouterTabbedComponent;
