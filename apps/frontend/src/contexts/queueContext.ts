import { Action, Queue } from "@test-boilerplate/queue";
import { useState } from "react";
import { createContext } from "vm";

const QueueContext = createContext()

const QueueContextProvider = ({children}) =>{
    const [actions, setActions] = useState<Action[]>()
    const [queue, setQueue] = useState<Queue>()

    const addActionToQueue = (action : Action) =>{
       queue?.addAction() 
    } 
    
}