import { Queue, Action } from "@test-boilerplate/queue";

export interface InitResponse{
  queue : Queue 
  actions : Action[]
}

export type ConsumedActionResponse = 
|{type : "consumption", action : Action}
|{type : "reset", actionsList : Action[]}
|{type : "error", message : string }

