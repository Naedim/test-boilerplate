// import { UnknownActionInSavedueue } from '@test-boilerplate/errors';
import { Action, Queue } from '@test-boilerplate/queue';
import { InitResponse } from '@test-boilerplate/responses';
import fs from 'fs';
const dataFile = 'data.json';

// const defaultActions = [
//   new Action('A', generateCredit(maxCredit)),
//   new Action('B', generateCredit(maxCredit)),
//   new Action('C', generateCredit(maxCredit)),
// ];

class QueueStore {
  private static instance: QueueStore;
  public actions: Action[] = [];
  public queue: Queue;

  private constructor() {
    this.initData();
    console.log('queue action  : ', this.queue.list);
    // this.actions = [
    //   new Action('A', 1),
    //   new Action('B', generateCredit(maxCredit)),
    //   new Action('C', generateCredit(maxCredit)),
    // ];

    // this.queue = new Queue([
    //   this.actions[0],
    //   this.actions[0],
    //   this.actions[0],
    //   this.actions[1],
    //   this.actions[1],
    //   this.actions[2],
    // ]);
  }

  public static getInstance(): QueueStore {
    if (!QueueStore.instance) {
      QueueStore.instance = new QueueStore();
    }
    return QueueStore.instance;
  }

  public getState(): InitResponse {
    return { queue: this.queue, actions: this.actions };
  }
  public save() {
    console.log('Store calling data save');
    fs.writeFileSync(
      dataFile,
      JSON.stringify({ queue: this.queue, actions: this.actions }),
      'utf-8'
    );
  }

  /**
   * read data from the data file and parse it as working Actions and Queue instances 
   * if an action in the saved queue is not known from the list of specified actions, 
   * an error message is loged and the action is skipped from the list
   */
  public initData() {
    const data: InitResponse = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    this.actions = data.actions.map((ac) => new Action(ac.name, ac.credits));
    const queueCurrentActions : Action[] = []

    console.log("data  : ", data.queue)
    data.queue.list.forEach((queueAction) => {
      const correspondingAction = this.actions.find(
        (action) => action.name === queueAction.name
      );
      if (correspondingAction === undefined) {
        // console.error(new UnknownActionInSavedQueue(queueAction.name));
        console.error("Unknown action : ", queueAction.name );
        return
      }
      queueCurrentActions.push(correspondingAction)
    });

    this.queue = new Queue(queueCurrentActions);
  }
  
}

export default QueueStore.getInstance();
