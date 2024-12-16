import { Box } from '@mui/material';
import React from 'react';
import { PangeaColors } from 'styles';
import { GridTabLayout, ListTableOfContents } from '../shared';

export const TableOfContentsDocumentTab = ({
  mainChildren,
  listItems,
}: {
  mainChildren: React.ReactNode[];
  listItems: {
    text: string;
    href?: string;
    icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    title?: boolean;
  }[];
}) => {
  return (
    <GridTabLayout
      main={
        <Box
          sx={{
            bgcolor: PangeaColors.White,
            border: `1px solid ${PangeaColors.Gray}`,
            borderRadius: '4px',
            padding: '24px',
          }}
        >
          {mainChildren.map((child, index) => (
            <Box key={index}>{child}</Box>
          ))}
        </Box>
      }
      aside={<ListTableOfContents listItems={listItems} />}
      isTabPanel={false}
      asidePosition={'left'}
    />
  );
};
export default TableOfContentsDocumentTab;
