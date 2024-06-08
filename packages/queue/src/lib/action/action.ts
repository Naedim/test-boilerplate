import {NoCreditRemaining, WrongAttributes} from '@test-boilerplate/errors'

export interface ActionAttributes {
  name : string;
  credits : number;
}
export class Action implements ActionAttributes{

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

