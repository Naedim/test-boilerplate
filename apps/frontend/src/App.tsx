import { ConsumedActionResponse } from '@test-boilerplate/responses';
import { InitResponse } from '@test-boilerplate/responses';
import { Action } from 'packages/queue/src/lib/action/action';
import { Queue } from 'packages/queue/src/lib/queue/queue';
import { useEffect, useState } from 'react';

export const App = () => {
  const [actions, setActions] = useState<Action[]>([])
  const [queue, setQueue] = useState<Queue>()

  useEffect(() => {
    //init the state of actions and queue
    fetch("http://localhost:3000/").then(res => {
      res.json().then((data: InitResponse) => {
        setActions(data.actions);
        setQueue(queue)
      })
    }).then(() => {
      // listen to action comsumption events from the server
      const sse = new EventSource('http://localhost:3000/action-consumption-events')
      sse.onmessage = e => {
        const response  : ConsumedActionResponse= JSON.parse(e.data)
        console.log("casted e : ", response)
        if(response.type === 'error'){
        console.log("Error", response)
          alert(response.message)
        }
        else if(response.type === "success"){

        console.log("Response", response)
        }else{
          console.log("WTF")
        }

      }
    }).catch((err: Error) => {
      console.error("Error while connecting to the server : ", err.message);
    })
  }, [])

  return (
    <>
      {actions.forEach((ac: Action) => {
        <p>{ac.name}</p>
      })}
    </>
  )
}