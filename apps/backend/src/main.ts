import express from 'express';
import cors from 'cors';
import { actionRouter } from './routes/actionRoute';
import QueueStore from './queue-store';
import { eventRouter } from './routes/eventRoute';
import {SERVER_PORT, SERVER_HOST, EVENTS_ENTRY, ACTION_ENTRY} from '@test-boilerplate/endpoints'
const app = express();
app.use(express.json())
app.use(cors());
// give the list of initial actions and initial queue of actions
app.get('/', (_, res) => {
  res.json(QueueStore.getState());
});

app.use(EVENTS_ENTRY, eventRouter)
app.use(ACTION_ENTRY, actionRouter)

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`[ ready ] http://${SERVER_HOST}:${SERVER_PORT}`);
});
