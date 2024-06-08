import { ConsumeActionResponse, QueueStateResponse } from '@test-boilerplate/responses';
import { ActionAttributes } from 'packages/queue/src/lib/action/action';
import { useContext, useEffect } from 'react';
import { QueueContext } from './contexts/queueContext';
import { ActionCard } from './components/action-card';
import { Queue } from './components/queue';
import { NoCreditRemaining } from '@test-boilerplate/errors';

export const App = () => {
  // const [actions, setActions] = useState<Action[]>([])
  // const [queue, setQueue] = useState<Queue>()

  const { setActions, setQueue, consumeFirstActionCredits, removeActionOccurrences } = useContext(QueueContext)

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
        const response: ConsumeActionResponse = JSON.parse(e.data)

        switch (response.type) {
          case "error":
            console.error(response.message)
            break;

          case "noCredits":
            console.error(new NoCreditRemaining(response.actionName))
            removeActionOccurrences(response.actionName)            
             break;

          case "consumption":
            console.log("action : ", response.actionName)
            if(response.actionName) {
              consumeFirstActionCredits(response.actionName)
            }
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
    <div className="h-screen w-screen bg-gradient-to-r from-sky-100 to-sky-200">
      {/* title of the app  */}
      <div className='bg-gradient-to-r from-violet-300 to-blue-300  p-2 flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-violet-700'>Action Queue App</h1>
        <p className='font-bold'>Damien NOEL </p>
      </div>

      {/* main content */}
      <div className='px-4'>


        {/* action queue */}
        <div className='mt-4'>
          <p className="text-center text-lg font-semibold">Action Queue</p>
          <Queue />
        </div>

        {/* list of available actions */}
        <div className='pt-4'>
          <p className="text-center text-lg font-semibold mb-4">Click on an action to add it to the queue</p>
          <ActionList />
        </div>
        {/* button to add a new action */}

        <div className="flex gap-2">
          {/* <p className = "text-5xl font-bold"> Faites de LinkedIn votre canal d’acquisition n°1</p> */}
        </div>
      </div>
    </div>
  )
}




export const ActionList = () => {
  const { actions } = useContext(QueueContext)
  return (
    <div className='flex h-full items-center justify-center flex-wrap gap-6'>
      {actions.map((action: ActionAttributes) => <ActionCard key={action.name} action={action} />)}
    </div>
  )
}