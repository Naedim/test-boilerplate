import * as dotenv from 'dotenv'
import { ActionEventResponse } from '@test-boilerplate/responses';
import { Router } from 'express';
import queueStore from '../queue-store';
import { CustomError, GeneralPurposeError, NoCreditRemaining } from '@test-boilerplate/errors';
import { EVENTS_ACTIONS } from '@test-boilerplate/endpoints';

dotenv.config()
const ACTION_CONSUMPTION_INTERVAL = process.env.ACTION_CONSUMPTION_INTERVAL  as unknown as number|| 15000 
const ACTION_RESET_INTERVAL = process.env.ACTION_RESET_INTERVAL as unknown as number|| 600000

const router = Router();
//function used to send event to the client
const sendEvent = (data: ActionEventResponse, res) => {

  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

// send the periodic events to the client (action comsumption or actions's credits resets)
router.get(EVENTS_ACTIONS, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');


  /**
   * consume an action from the queueStore. 
   * If an action lacks credits : 
   * - removes the next occurences of the action 
   * - send an noCredits event to the client 
   * - tries again
   */
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
        queueStore.removeActionOccurences(err.actionName)

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
        throw new GeneralPurposeError()
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
  }, ACTION_CONSUMPTION_INTERVAL);

  const actionCreditsResetLoopId = setInterval(() => {
    resetActions();
  }, ACTION_RESET_INTERVAL);

  // Cleans up when the client closes the connection
  req.on('close', () => {
    clearInterval(actionCreditsResetLoopId);
    clearInterval(actionConsumptionLoopId);
    res.end();
  });

});

export {router as eventRouter}