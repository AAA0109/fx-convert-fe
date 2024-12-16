import { Box } from '@mui/material';
import { GridTabLayout, ListMenu, TabPanel } from 'components/shared';
import { IAccountPageListItem } from 'lib';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect, useState } from 'react';

export const AccountTab = ({
  mainChildren,
  listItems,
  pathPart,
  defaultIndex = 0,
}: {
  pathPart: string;
  mainChildren: ReactNode[];
  listItems: IAccountPageListItem[];
  defaultIndex: number;
}) => {
  const [selectedListItem, setSelectedListItem] = useState(0);
  const router = useRouter();
  const navigateTab = useCallback(
    (selectedIndex: number) => {
      const l = listItems[selectedIndex];
      router.push(
        `/account/${pathPart}/${l.urlPathPart}`,
        `/account/${pathPart}/${l.urlPathPart}`,
      );
      setSelectedListItem(selectedIndex);
    },
    [listItems, pathPart, router],
  );
  useEffect(() => {
    setSelectedListItem(defaultIndex);
  }, [defaultIndex]);
  return (
    <GridTabLayout
      main={
        <Box
          sx={{
            borderRadius: '4px',
            padding: '24px',
            width: '564px',
          }}
        >
          {mainChildren.map((child, index) => (
            <TabPanel value={selectedListItem} index={index} key={index}>
              {child}
            </TabPanel>
          ))}
        </Box>
      }
      aside={
        <ListMenu
          stateGetter={selectedListItem}
          stateSetter={navigateTab}
          listItems={listItems}
        />
      }
      isTabPanel={false}
      asidePosition={'left'}
    />
  );
};
export default AccountTab;
