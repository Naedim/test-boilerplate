import { Action, ActionAttributes } from "@test-boilerplate/queue"

/**
 * @field queue : a list of action's names that represent the order of actions in the queue
 * @field actions : the exisiting actions
 */
export interface QueueStateResponse{
  queue : string[] 
  actions : ActionAttributes[]
}

export interface ErrorResponse{
  error : string
}

export type ActionEventResponse = 
ActionEventConsumptionResponse
|ActionEventNoCreditResponse
|ActionEventResetResponse
|ActionEventErrorResponse



export type ActionEventConsumptionResponse = {type : "consumption", actionName: Action['name'] | null}
export type  ActionEventNoCreditResponse= {type : "noCredits", actionName: Action['name']}
export type  ActionEventResetResponse= {type : "reset", actionsList : Action[]}
export type  ActionEventErrorResponse= {type : "error", message : string }
