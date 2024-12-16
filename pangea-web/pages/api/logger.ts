import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../components/global/Logger';
const loggerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { pathname, application, title } = req.body;
    logger.info(title, {
      application,
      pathname,
    });
    res.status(200).send({});
  } catch (e: any) {
    res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};
export default loggerHandler;
