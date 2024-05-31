import { NoCreditRemaining, WrongAttributes } from '@test-boilerplate/errors';
import { Action } from '../action/action';

describe('action', () => {
  it('constructor test', () => {
    expect(()=> new Action("A", 0)).toThrow(WrongAttributes)
    expect(()=> new Action("", 2)).toThrow(WrongAttributes)
    const action = new Action("A", 2)
    expect(action).toBeTruthy()
    expect(action.name).toEqual("A")
    expect(action.credits).toEqual(2)
  });

  it('test credits consumption', () =>{
    const action = new Action("B", 2)
    action.consumeCredit()
    expect(action.credits).toEqual(1)
    action.consumeCredit()
    expect(action.credits).toEqual(0)
    expect(()=> action.consumeCredit()).toThrow(NoCreditRemaining)
  }) 

});
