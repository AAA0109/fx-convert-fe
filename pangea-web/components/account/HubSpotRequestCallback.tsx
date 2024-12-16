import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

export const HubSpotRequestCallback = () => {
  const scriptContainer = useRef<Nullable<HTMLDivElement>>(null);
  const scriptSet = useRef(false);
  useEffect(() => {
    if (scriptSet.current) {
      return;
    }
    const script = document.createElement('script');
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    script.type = 'text/javascript';
    script.defer = true;
    if (scriptContainer.current) {
      scriptContainer.current.appendChild(script);
    }
    scriptSet.current = true;
  }, []);
  return (
    <>
      <div ref={scriptContainer}></div>
      <Box
        className='meetings-iframe-container'
        data-src='https://meetings.hubspot.com/brian-divine/client-success?embed=true'
        sx={{ width: '100%', height: '100%' }}
      ></Box>
    </>
  );
};
export default HubSpotRequestCallback;
