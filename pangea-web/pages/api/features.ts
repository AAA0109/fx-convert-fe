import { NextApiRequest, NextApiResponse } from 'next';

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (_req: NextApiRequest, res: NextApiResponse) => {
  res
    .status(200)
    .json([
      process.env.FEATURE_LINK_WITHDRAWAL_ACCOUNT === 'true'
        ? 'link_withdrawal_account'
        : '',
    ]);
};
