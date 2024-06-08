export class GeneralPurposeError extends Error{
 constructor(){
  super("An error occured, our engineer are working on it. Pls come back later or contact our great support divison !") 
 }
}

export class CustomError extends Error{
 constructor(message : string){
  super(message) 
 }
}

export class WrongAttributes extends CustomError{
  constructor(message : string){
    super(`wrong attribute, ${message}`)
  }
}

export class NoCreditRemaining extends CustomError{
  public actionName : string;
  constructor(actionName : string){
    super(`no credit remaining for the action ${actionName}`)
    this.actionName = actionName
  }
}

export class UnknownAction extends CustomError{
  constructor(actionName : string){
    super(`The action ${actionName} is not known`)
  }
}