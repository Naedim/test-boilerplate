import { Request, Response, Router } from 'express';
import queueStore from '../queue-store';
import {AddActionPayload} from "@test-boilerplate/payloads"
import {ErrorResponse} from "@test-boilerplate/responses"
import { ACTION_ADD } from '@test-boilerplate/endpoints';
const router = Router();

router.post(ACTION_ADD, (req: Request, res: Response) => {
  const payload: AddActionPayload = req.body;

  if (!('actionName' in payload && typeof payload.actionName === 'string')) {
    const response: ErrorResponse = {
      error: 'Wrong payload for action addition',
    };
    res.status(400).json(response);
  }

  queueStore.addAction(payload.actionName)
  res.sendStatus(200)

});

export { router as actionRouter };
