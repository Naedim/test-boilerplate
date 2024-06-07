import {Action } from "@test-boilerplate/queue";
import { ActionAttributes } from "packages/queue/src/lib/action/action";

/**
 * @field queue : a list of action's names that represent the order of actions in the queue
 * @field actions : the exisiting actions
 */
export interface QueueStateResponse{
  queue : string[] 
  actions : ActionAttributes[]
}

export type ConsumedActionResponse = 
|{type : "consumption", action : Action}
|{type : "reset", actionsList : Action[]}
|{type : "error", message : string }

