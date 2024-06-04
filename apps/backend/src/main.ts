import express from 'express';
import cors from 'cors'
import { ConsumedActionResponse, InitResponse } from '@test-boilerplate/responses';

import { Action, Queue} from '@test-boilerplate/queue';
import { CustomError } from '@test-boilerplate/errors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(cors());
  const maxCredit = 10

  /**
   * 
   * @param max max expectedValue
   * @returns random value between 80% and 100% of the max given value
   */
  const generateCredit = (max : number)=>{
    // random value between 0.8 and 1 
    const rand = Math.random() * 0.2 + 0.8
    return Math.round(rand * max)
  }

  // const actions :Action[]= [new Action("A", generateCredit(maxCredit)), new Action("B", generateCredit(maxCredit)), new Action("C", generateCredit(maxCredit))]
  // const queue = new Queue(actions)
  const actions :Action[]= [new Action("A", 1), new Action("B", generateCredit(maxCredit)), new Action("C", generateCredit(maxCredit))]
  const queue = new Queue([actions[0], actions[0], actions[0],actions[1], actions[1], actions[2]])
  
  // allow the user to connect and register to the action consumption event
  app.get('/', (_, res ) => {
    const value : InitResponse = {queue : queue, actions : actions}
    res.json(value) 

  })

  // manage to send to the client the event of consuming an action in the queue
  app.get('/action-consumption-events', (req, res ) => {
    console.log("received request")
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    const sendEvent = (data : ConsumedActionResponse) => {
      console.log("stringified data : ", data)
      console.log()
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
  
    // the loop that will consumed periodically the first action in the queue
    const consumeAction = ()=>{
      try{
        const consumedAction = queue.consumeFirstActionCredits()
        if(consumedAction){
          const response : ConsumedActionResponse = {type : "success", action : consumedAction}
          sendEvent(response);
        }
      }catch(err){
        //if customError, send error message to the client and consume the next action
        if(err instanceof CustomError){
          const response : ConsumedActionResponse = {type : "error", message: err.message}
          sendEvent(response)
          consumeAction()
        }
      }
    }

    const intervalId = setInterval(() => {
      consumeAction()
    }, 3000);
  
    // Cleans up when the client closes the connection
    req.on('close', () => {
      console.log("Connection was closed")
      clearInterval(intervalId);
      res.end();
    });
  })

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
