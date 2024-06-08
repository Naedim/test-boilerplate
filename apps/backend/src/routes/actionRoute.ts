import { Request, Response, Router } from 'express';
import { ErrorResponse } from '@test-boilerplate/responses';
import { AddActionPayload } from '@test-boilerplate/payloads';
import queueStore from '../queue-store';

const router = Router();

router.post('/add', (req: Request, res: Response) => {
  const payload: AddActionPayload = req.body;

  if (!('actionName' in payload && typeof payload.actionName === 'string')) {
    const response: ErrorResponse = {
      error: 'Wrong payload for action addition',
    };
    res.status(400).json(response);
  }

  console.log("receive request to add action : ",payload.actionName )
  queueStore.addAction(payload.actionName)
  console.log("returning 200")
  res.sendStatus(200)

});

export { router as actionRouter };
