import { ConsumedActionResponse, QueueStateResponse } from '@test-boilerplate/responses';
import { Action } from 'packages/queue/src/lib/action/action';
import { useContext, useEffect } from 'react';
import { QueueContext } from './contexts/queueContext';

export const App = () => {
  // const [actions, setActions] = useState<Action[]>([])
  // const [queue, setQueue] = useState<Queue>()

  const {actions, setActions, queue, setQueue, consumeFirstActionCredits} = useContext(QueueContext)

  useEffect(() => {
    //init the state of actions and queue
    fetch("http://localhost:3000/").then(res => {
      res.json().then((data: QueueStateResponse) => {
        setActions(data.actions);
        setQueue(data.queue)

      })
    }).then(() => {
      // listen to action comsumption events from the server
      const sse = new EventSource('http://localhost:3000/events/actions')
      sse.onmessage = e => {
        const response: ConsumedActionResponse = JSON.parse(e.data)

        switch (response.type) {
          case "error":
            console.error(response.message)
            break;

          case "consumption":
            consumeFirstActionCredits(response.action.name)
            break;

          case "reset":
            setActions(response.actionsList)
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
          return <p key={action.name}>{action.name} {action.credits}</p>
        })}
        
        <div className = "flex gap-2">
        {queue.map((actionName, index) => {
          return <p key={index}>{actionName}</p>
        })}
        </div>
    </div>
  )
}