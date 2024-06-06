import { ConsumedActionResponse, QueueStateResponse } from '@test-boilerplate/responses';
import { Action } from 'packages/queue/src/lib/action/action';
import { Queue } from 'packages/queue/src/lib/queue/queue';
import { useEffect, useState } from 'react';

export const App = () => {
  const [actions, setActions] = useState<Action[]>([])
  const [queue, setQueue] = useState<Queue>()

  useEffect(() => {
    //init the state of actions and queue
    fetch("http://localhost:3000/").then(res => {
      res.json().then((data: QueueStateResponse) => {
        setActions(data.actions);
        setQueue(queue)
      })
    }).then(() => {
      // listen to action comsumption events from the server
      const sse = new EventSource('http://localhost:3000/action-events')
      sse.onmessage = e => {
        const response: ConsumedActionResponse = JSON.parse(e.data)
        console.log("casted e : ", response)

        switch(response.type){
          case "error" :
            console.error(response.message)
            break;

          case "consumption" :
            console.log("consumption of action : ", response.action)
            break;

          case "reset" :
            console.log("reset of actions's credits : ", response.actionsList)
            break;

        }
      }
    }).catch((err: Error) => {
      console.error("Error while connecting to the server : ", err.message);
    })
  }, [])

  return (
    <div className="h-screen w-screen">
      {actions.map((action: Action) => {
        return <p key = {action.name}>{action.name}</p>
      })}
    </div>
  )
}