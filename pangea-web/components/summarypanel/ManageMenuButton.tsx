import { MenuItem, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export const ManageMenuButton = (props: {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  isDivider?: boolean;
  containerStackSpacing?: string | number;
  typographyStackSpacing?: string | number;
  onClick?: () => void;
}) => {
  const {
    icon,
    title,
    description,
    href,
    isDivider = false,
    containerStackSpacing,
    typographyStackSpacing,
    onClick,
  } = props;
  const router = useRouter();
  return (
    <MenuItem
      divider={isDivider}
      sx={{ width: '240px', padding: '1rem', margin: 0 }}
      onClick={() => {
        if (href) router.push(href);
        if (onClick) onClick();
      }}
      aria-label={title}
    >
      <Stack
        direction='column'
        justifyContent='space-between'
        whiteSpace='normal'
        spacing={containerStackSpacing ?? 1.5}
      >
        <Stack
          direction='row'
          justifyContent='left'
          alignItems={'center'}
          spacing={typographyStackSpacing ?? 1}
        >
          {icon}
          <Typography
            variant='inputText'
            sx={{ textTransform: 'none', marginBottom: '.75rem' }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography variant='body1' sx={{ textTransform: 'none' }}>
          {description}
        </Typography>
      </Stack>
    </MenuItem>
  );
};
export default ManageMenuButton;
