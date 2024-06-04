import { Queue, Action } from "@test-boilerplate/queue";

export interface InitResponse{
  queue : Queue 
  actions : Action[]
}

export type ConsumedActionResponse = 
|{type : "success", action : Action}
|{type : "error", message : string }

