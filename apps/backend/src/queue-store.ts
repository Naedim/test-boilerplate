import * as dotenv from 'dotenv'
// import { UnknownActionInSavedueue } from '@test-boilerplate/errors';
import { UnknownAction } from '@test-boilerplate/errors';
import { generateQueueAndAction } from '@test-boilerplate/helpers';
import { Action, Queue, QueueStateData } from '@test-boilerplate/queue';
import { QueueStateResponse } from '@test-boilerplate/responses';
import fs from 'fs';

dotenv.config()

const dataFile = process.env.QUEUE_STORE_SAVE_PATH as unknown as string;
const maxCredit = process.env.MAX_ACTION_CREDIT as unknown as number;

/**
 * @param max max expectedValue
 * @returns random value between 80% and 100% of the max given value
 */
const generateCredit = (max: number) => {
  // random value between 0.8 and 1
  const rand = Math.random() * 0.2 + 0.8;
  return Math.round(rand * max);
};

//the default actions used in no there is no save of the data
const defaultActions = [
  new Action('A', generateCredit(maxCredit)),
  new Action('B', generateCredit(maxCredit)),
  new Action('C', generateCredit(maxCredit)),
  new Action('D', generateCredit(maxCredit)),
  new Action('E', generateCredit(maxCredit)),
  new Action('F', generateCredit(maxCredit)),
];

class QueueStore {
  private static instance: QueueStore;
  private actions: Action[] = [];
  private queue: Queue;

  private constructor() {
    this.initData();
  }

  public static getInstance(): QueueStore {
    if (!QueueStore.instance) {
      QueueStore.instance = new QueueStore();
    }
    return QueueStore.instance;
  }

  public getActions() {
    return this.actions;
  }

  public getActionQueue() {
    return this.queue.getList();
  }

  public getState(): QueueStateResponse {
    return {
      queue: this.queue.getList().map((ac) => ac.name),
      actions: this.actions,
    };
  }

  public consumeAction() {
    const consumedAction = this.queue.consumeFirstActionCredits();
    this.save()
    return consumedAction
  }

  public addAction(actionName: string) {
    const action = this.actions.find((a) => a.name === actionName);
    if(!action) throw new UnknownAction(actionName);
    
    this.queue.addAction(action);
    this.save();
    return;
  }

  public resetActions() {
    this.actions.forEach(
      (action) => (action.credits = generateCredit(maxCredit))
    );
    this.save()
  }

  public removeActionOccurences(actionName : string){
    this.queue.removeActionOccurrences(actionName)
    this.save()
  }

  public save() {
    fs.writeFileSync(dataFile, JSON.stringify(this.getState()), 'utf-8');
  }

  /**
   * read data from the data file and parse it as working Actions and Queue instances
   * if an action in the saved queue is not known from the list of specified actions,
   * an error message is loged and the action is skipped from the list
   */
  public initData() {
    if (!fs.existsSync(dataFile)) {
      this.actions = defaultActions;
      this.queue = new Queue()
      return
    }
    const data: QueueStateData = JSON.parse(
      fs.readFileSync(dataFile, 'utf-8')
    );

    const res = generateQueueAndAction(data)

    this.actions = res.actions
    this.queue = res.queue
  }
}

export default QueueStore.getInstance();
