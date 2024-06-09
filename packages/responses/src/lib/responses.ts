import { Action, ActionState, QueueStateData } from '@test-boilerplate/queue';



export type QueueStateResponse = QueueStateData;

export interface ErrorResponse {
  error: string;
}

export type ActionEventResponse =
  | ActionEventConsumptionResponse
  | ActionEventNoCreditResponse
  | ActionEventResetResponse
  | ActionEventErrorResponse;

export type ActionEventConsumptionResponse = {
  type: 'consumption';
  actionName: Action['name'] | null;
};

export type ActionEventNoCreditResponse = {
  type: 'noCredits';
  actionName: Action['name'];
};

export type ActionEventResetResponse = { type: 'reset'; actionsList: ActionState[] };

export type ActionEventErrorResponse = { type: 'error'; message: string };
