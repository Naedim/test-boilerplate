import {NoCreditRemaining, WrongAttributes} from '@test-boilerplate/errors'

export interface ActionState {
  name : string;
  credits : number;
}
export class Action implements ActionState{

  public name : string;
  public credits : number;

  public constructor(name : string, credits : number){
    if(!name)throw new WrongAttributes("action can't have a empty string as name")
    this.name = name;
    this.credits = credits;
  }

  consumeCredit(){
    if(!this.credits) throw new NoCreditRemaining(this.name)
    this.credits-- 
  }

}

