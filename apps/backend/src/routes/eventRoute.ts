import { ActionEventResponse } from '@test-boilerplate/responses';
import { Router } from 'express';
import queueStore from '../queue-store';
import { CustomError, NoCreditRemaining } from '@test-boilerplate/errors';

const router = Router();

//function used to send event to the client
const sendEvent = (data: ActionEventResponse, res) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

// send the periodic events to the client (action comsumption or actions's credits resets)
router.get('/actions', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');


  const consumeAction = () => {
    try {
      const consumedAction = queueStore.consumeAction();
      if (consumedAction) {
        const response: ActionEventResponse = {
          type: 'consumption',
          actionName: consumedAction.name,
        };
        sendEvent(response, res);
      }
    } catch (err) {
      //if customError, send error message to the client and consume the next action
      if (err instanceof CustomError) {
        let response: ActionEventResponse;
        if(err instanceof NoCreditRemaining){
          response ={
            type: 'noCredits',
            actionName: err.actionName,
          }
        }else{
          response ={
            type: 'error',
            message: err.message,
          }

        }
          
        sendEvent(response, res);
        consumeAction();
      }
      else{
        console.error(err)
      }
    }
  };

  const resetActions = () => {
    queueStore.resetActions()
    const response: ActionEventResponse = {
      type: 'reset',
      actionsList: queueStore.getActions(),
    };
    sendEvent(response, res);
  };

  const actionConsumptionLoopId = setInterval(() => {
    consumeAction();
  }, 1000);

  const actionCreditsResetLoopId = setInterval(() => {
    resetActions();
  }, 10000);

  // Cleans up when the client closes the connection
  req.on('close', () => {
    clearInterval(actionCreditsResetLoopId);
    clearInterval(actionConsumptionLoopId);
    res.end();
  });

});

export {router as eventRouter}