import express from 'express';
import cors from 'cors';
import { eventRouter } from './routes/eventRoute';

import QueueStore from './queue-store';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(cors());
// give the list of initial actions and initial queue of actions
app.get('/', (_, res) => {
  res.json(QueueStore.getState());
});

app.use("/events", eventRouter)

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
