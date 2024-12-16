import Script from 'next/script';

export const NewRelicScript = () => {
  return (
    <Script type='text/javascript' src='/scripts/newrelic.js' defer={false} />
  );
};
export default NewRelicScript;
