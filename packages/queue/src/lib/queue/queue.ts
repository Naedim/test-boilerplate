import { Action } from "../action/action";

export class Queue{
  private list :Action[] = [];
  
  constructor(list : Action[] = []){
    this.list = list 
  }

  public getList(){
    return this.list
  }
  public addAction(action : Action){
    this.list.push(action)
  }

  public consumeFirstActionCredits() : Action | undefined {
    // if this.list is empty, then this.list.shift() returns undefined
    const action = this.list.shift()
    if(action) action.consumeCredit()
    return action
  }

}