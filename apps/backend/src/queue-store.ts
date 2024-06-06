// import { UnknownActionInSavedueue } from '@test-boilerplate/errors';
import { UnknownAction } from '@test-boilerplate/errors';
import { Action, Queue } from '@test-boilerplate/queue';
import { QueueStateResponse } from '@test-boilerplate/responses';
import fs from 'fs';

const dataFile = 'data.json';
const maxCredit = 10;

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
];

class QueueStore {
  private static instance: QueueStore;
  private actions: Action[] = [];
  private queue: Queue;

  private constructor() {
    this.initData();
    console.log('queue action  : ', this.queue.list);
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
    return this.queue.list;
  }

  public getState(): QueueStateResponse {
    return {
      queue: this.queue.list.map((ac) => ac.name),
      actions: this.actions,
    };
  }

  public consumeAction() {
    return this.queue.consumeFirstActionCredits();
  }

  public addAction(actionName: string) {
    const action = this.actions.find((a) => a.name === actionName);
    if (action) {
      this.queue.addAction(action);
      return;
    }
    throw new UnknownAction(actionName);
  }
  public save() {
    console.log('Store calling data save');
    fs.writeFileSync(dataFile, JSON.stringify(this.getState()), 'utf-8');
  }

  public resetActions() {
    this.actions.forEach(
      (action) => (action.credits = generateCredit(maxCredit))
    );
  }

  /**
   * read data from the data file and parse it as working Actions and Queue instances
   * if an action in the saved queue is not known from the list of specified actions,
   * an error message is loged and the action is skipped from the list
   */
  public initData() {
    if (!fs.existsSync(dataFile)) {
      this.actions = defaultActions;
    }
    const data: QueueStateResponse = JSON.parse(
      fs.readFileSync(dataFile, 'utf-8')
    );

    // some actions of the save file may not be part of the accepted actions labels of the app, checking for that
    //filtering all the saved actions that are part of the default actions names
    const acceptedActionsNames = defaultActions.map((ac) => ac.name);
    const acceptedSavedActions = data.actions.filter((savedAction) =>
      acceptedActionsNames.includes(savedAction.name)
    );

    //generating the list of existing Actions
    this.actions = acceptedSavedActions.map(
      (ac) => new Action(ac.name, ac.credits)
    );

    //now we generate a list of Action's references, then instantiate a new Queue with it
    const QueueActions: Action[] = [];
    data.queue.forEach((actionName) => {
      const actionReference = this.actions.find(
        (action) => action.name === actionName
      );
      if (!actionReference) {
        // console.error(new UnknownAction(actionName));
        console.error(`An unknown action has been found: ${actionName}`);
        return;
      }
      QueueActions.push(actionReference);
    });

    this.queue = new Queue(QueueActions);
  }
}

export default QueueStore.getInstance();
