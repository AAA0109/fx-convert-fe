import { HttpErrorStatusDisplay } from 'components/shared';
import { HttpErrorStatusCode } from 'lib';
import { NextPage } from 'next';
import Head from 'next/head';

const Custom404Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pangea - Not Found</title>
      </Head>
      <HttpErrorStatusDisplay
        statusCode={HttpErrorStatusCode.NOT_FOUND}
        title='Page not found'
        description="Sorry, the page you are looking for doesn't exist or has been
            moved."
      />
    </>
  );
};

export default Custom404Page;
