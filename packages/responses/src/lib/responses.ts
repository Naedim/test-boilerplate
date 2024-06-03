import { Action } from "packages/queue/src/lib/action/action";
import { Queue } from "packages/queue/src/lib/queue/queue";

export interface InitResponse{
  queue : Queue 
  actions : Action[]
}