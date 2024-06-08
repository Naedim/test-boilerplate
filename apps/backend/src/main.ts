import express from 'express';
import cors from 'cors';
import { actionRouter } from './routes/actionRoute';
import QueueStore from './queue-store';
import { eventRouter } from './routes/eventRoute';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(express.json())
app.use(cors());
// give the list of initial actions and initial queue of actions
app.get('/', (_, res) => {
  res.json(QueueStore.getState());
});

app.use("/events", eventRouter)
app.use("/action", actionRouter)

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
