import express from 'express';
import cors from 'cors';
import {
  ConsumedActionResponse,
  InitResponse,
} from '@test-boilerplate/responses';

import { CustomError } from '@test-boilerplate/errors';
import QueueStore from './queue-store';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(cors());
// const actions :Action[]= [new Action("A", generateCredit(maxCredit)), new Action("B", generateCredit(maxCredit)), new Action("C", generateCredit(maxCredit))]
// const queue = new Queue(actions)
// const actions :Action[]= [new Action("A", 1), new Action("B", generateCredit(maxCredit)), new Action("C", generateCredit(maxCredit))]

/**
 * @param max max expectedValue
 * @returns random value between 80% and 100% of the max given value
 */
const generateCredit = (max: number) => {
  // random value between 0.8 and 1
  const rand = Math.random() * 0.2 + 0.8;
  return Math.round(rand * max);
};

const maxCredit = 10;

// allow the user to connect and register to the action consumption event
app.get('/', (_, res) => {
  console.log('actions : ', QueueStore.actions);
  const value: InitResponse = {
    queue: QueueStore.queue,
    actions: QueueStore.actions,
  };
  res.json(value);
});

const sendEvent = (data: ConsumedActionResponse, res) => {
  console.log('stringified data : ', data);
  console.log();
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

// send the periodic events to the client (action comsumption or actions's credits resets)
app.get('/action-events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // the loop that will consumed periodically the first action in the queue
  const consumeAction = () => {
    try {
      const consumedAction = QueueStore.queue.consumeFirstActionCredits();
      if (consumedAction) {
        const response: ConsumedActionResponse = {
          type: 'consumption',
          action: consumedAction,
        };
        sendEvent(response, res);
      }
    } catch (err) {
      //if customError, send error message to the client and consume the next action
      if (err instanceof CustomError) {
        const response: ConsumedActionResponse = {
          type: 'error',
          message: err.message,
        };
        sendEvent(response, res);
        consumeAction();
      }
    }
  };
  
  const resetActions = () => {
    QueueStore.actions.forEach(
      (action) => (action.credits = generateCredit(maxCredit))
    );

    const response: ConsumedActionResponse = {
      type: 'reset',
      actionsList: QueueStore.actions,
    };
    sendEvent(response, res);
  };

  const actionConsumptionLoopId = setInterval(() => {
    consumeAction();
  }, 3000);


  const actionCreditsResetLoopId = setInterval(() => {
    resetActions();
  }, 10000);

  // Cleans up when the client closes the connection
  req.on('close', () => {
    console.log('Connection was closed');
    clearInterval(actionCreditsResetLoopId);
    clearInterval(actionConsumptionLoopId);
    res.end();
  });

});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
