import { Action } from "../action/action";

export class Queue{
  public list :Action[] = [];
  
  constructor(list : Action[] = []){
    this.list = list 
  }

  public addAction(action : Action){
    this.list.push(action)
  }

  public consumeFirstActionCredits() : Action | null {
    // if this.list is empty, then this.list.shift() returns undefined
    const action = this.list.shift()
    if(!action) return null
    action.consumeCredit()
    return action
  }

}