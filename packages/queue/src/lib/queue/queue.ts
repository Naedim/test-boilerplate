import { Action, ActionState } from '../action/action';

/**
 * @field queue : a list of action's names that represent the order of actions in the queue
 * @field actions : the exisiting actions
 */
export interface QueueStateData{
  queue : string[] 
  actions : ActionState[]
}

export class Queue {
  private list: Action[] = [];

  constructor(list: Action[] = []) {
    this.list = list;
  }

  public getList() {
    return this.list;
  }
  public addAction(action: Action) {
    this.list.push(action);
  }

  public consumeFirstActionCredits(): Action | undefined {
    // if this.list is empty, then this.list.shift() returns undefined
    const action = this.list.shift();
    if (action) action.consumeCredit();
    return action;
  }

  /**
   *
   * @param actionName  name of the action to remove until another one is found
   * @returns none
   */
  public removeActionOccurrences(actionName: string) {
    //if there is not other action then the one to remove, clears the list
    const otherActionIndex = this.list.findIndex(
      (action) => action.name !== actionName
    );
    if (!otherActionIndex) {
      this.list = [];
      return;
    }
    this.list = this.list.slice(otherActionIndex, undefined);
  }
}
