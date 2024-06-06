import {NoCreditRemaining, WrongAttributes} from '@test-boilerplate/errors'

export class Action{
  public name : string;
  public credits : number;

  public constructor(name : string, credits : number){
    if(!name)throw new WrongAttributes("action can't have a empty string as name")
    if(credits <= 0)throw new WrongAttributes("action must start a starting number of credits greater then 0")
    this.name = name;
    this.credits = credits;
  }

  consumeCredit(){
    if(!this.credits) throw new NoCreditRemaining(this.name)
    this.credits-- 
  }

}

