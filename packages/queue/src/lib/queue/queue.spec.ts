import { NoCreditRemaining } from '@test-boilerplate/errors';
import { Action } from '../action/action';
import { Queue} from './queue';

describe('queue constructor', () => {

    let actionA : Action; 
    let actionB : Action; 

  beforeAll(() => {
    actionA = new Action("A", 1)
    actionB = new Action("B", 2)
  });
  it('constructor ', () => {
    const actionList = [actionA, actionB ] 
    
    let queue = new Queue()
    expect(queue).toBeTruthy()
    expect(queue.getList()).toEqual([])

    queue= new Queue(actionList)
    expect(queue).toBeTruthy()
    expect(queue.getList()).toEqual(actionList)
  });

  it('addition of actions ', () => {
    const queue = new Queue();
    queue.addAction(actionA)
    expect(queue.getList()).toEqual([actionA])

    queue.addAction(actionB)
    expect(queue.getList()).toEqual([actionA, actionB])

    queue.addAction(actionA)
    expect(queue.getList()).toEqual([actionA, actionB, actionA])
  })


  it('consumption of credits', () => {
    const actionList =  [actionA, actionB, actionA]
    const queue = new Queue(actionList)

    let expectedAttributes = {name : "A", credits : 0}
    let consumedAction = queue.consumeFirstActionCredits()
    expect(consumedAction).toMatchObject(expectedAttributes) 
    expect(queue.getList()).toEqual([actionB, actionA])

    expectedAttributes = {name : "B", credits : 1}
    consumedAction = queue.consumeFirstActionCredits()
    expect(consumedAction).toMatchObject(expectedAttributes) 
    expect(queue.getList()).toEqual([actionA])

    expect(()=> queue.consumeFirstActionCredits()).toThrow(NoCreditRemaining)
    expect(queue.consumeFirstActionCredits()).toBeUndefined()
  })

  it('removal of action occurences', () => {
    let actionList =  [actionA, actionA, actionB, actionA]
    let queue = new Queue(actionList)
    queue.removeActionOccurrences(actionA.name)
    const expectedList = [actionB, actionA]
    expect(queue.getList()).toEqual(expectedList)

    actionList =  [actionA, actionA, actionA, actionA, actionA]
    queue = new Queue(actionList)
    queue.removeActionOccurrences(actionA.name)
    expect(queue.getList()).toEqual([])
  })

});
