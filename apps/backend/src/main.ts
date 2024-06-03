import express from 'express';
import cors from 'cors'
import { Action } from 'packages/queue/src/lib/action/action';
import { Queue } from 'packages/queue/src/lib/queue/queue';
import { InitResponse } from '@test-boilerplate/responses';

const host = process.env.HOST ?? 'localhost';
// const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(cors());

  const maxCredit = 10

  const generateCredit = (max : number)=>{
    const randomPercentage = Math.random() * 0.2 + 0.8 
    return randomPercentage * max
  }

  const actions :Action[]= [new Action("A", generateCredit(maxCredit)), new Action("B", maxCredit), new Action("C", maxCredit)]
  const queue = new Queue()
  
  // allow the user to connect and register to the action consumption event
  app.get('/', (req, res ) => {
    const value : InitResponse = {queue : queue, actions : actions}
    res.json(value) 

  })

  app.get('/action-consumption-events', (req, res ) => {
    console.log("received request")
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    const sendEvent = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
  
    // Send an initial message
    sendEvent({ message: 'Connection established' });
  
    // Example: send a message every 5 seconds
    const intervalId = setInterval(() => {
      console.log("sending response")
      sendEvent({ message: 'Hello from the server!', timestamp: new Date() });
    }, 5000);
  
    // Clean up when the client closes the connection
    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  })
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
