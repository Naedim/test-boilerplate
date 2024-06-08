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

export type ConsumeActionResponse = 
|{type : "consumption", actionName: Action['name'] | null}
|{type : "noCredits", actionName: Action['name']}
|{type : "reset", actionsList : Action[]}
|{type : "error", message : string }

