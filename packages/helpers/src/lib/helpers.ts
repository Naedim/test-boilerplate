import { Action, Queue, QueueStateData } from '@test-boilerplate/queue';

export interface ActionsAndQueue {
  actions: Action[];
  queue: Queue;
}
export const generateQueueAndAction = (
  data: QueueStateData,
  defaultActions?: Action[]
): ActionsAndQueue => {
  // some actions of the save file may not be part of the accepted actions labels of the app, checking for that
  //filtering all the saved actions that are part of the default actions names
  let acceptedActions = data.actions;
  if (defaultActions) {
    const acceptedActionsNames = defaultActions.map((ac) => ac.name);

    acceptedActions = data.actions.filter((savedAction) =>
      acceptedActionsNames.includes(savedAction.name)
    );
  }

  //generating the list of existing Actions
  const existingAction = acceptedActions.map(
    (ac) => new Action(ac.name, ac.credits)
  );

  //now we generate a list of Action's references, then instantiate a new Queue with it
  const queueActions: Action[] = [];

  data.queue.forEach((actionName) => {
    const actionReference = existingAction.find(
      (action) => action.name === actionName
    );
    if (!actionReference) {
      return;
    }
    queueActions.push(actionReference);
  });

  return { actions: existingAction, queue: new Queue(queueActions) };
};
