import { ConsumedActionResponse, QueueStateResponse } from '@test-boilerplate/responses';
import { ActionAttributes } from 'packages/queue/src/lib/action/action';
import { useContext, useEffect } from 'react';
import { QueueContext } from './contexts/queueContext';

export const App = () => {
  // const [actions, setActions] = useState<Action[]>([])
  // const [queue, setQueue] = useState<Queue>()

  const { setActions, setQueue, consumeFirstActionCredits } = useContext(QueueContext)

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



    <div className="h-screen w-screen bg-gradient-to-r from-sky-100 to-sky-200">
      {/* title of the app  */}
      <div className='bg-gradient-to-r from-violet-300 to-blue-300  p-2 flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-violet-700'>Action Queue App</h1>
        <p className='font-bold'>Damien NOEL </p>
      </div>

      {/* main content */}
      <div className='px-4'>

        {/* action queue */}
        <Queue />

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

const Queue = () => {
  const { queue } = useContext(QueueContext)

  return (
    queue.map((actionName, index) => {
      return <p key={index}>{actionName}</p>
    })
  )
}

const ActionList = () => {
  // const { actions } = useContext(QueueContext)
  const actions : ActionAttributes[] = [
    { name: "A", credits: 1 },
    { name: "B", credits: 9 },
    { name: "C", credits: 9 }
  ]
  return (
    <div className='flex h-full items-center justify-center flex-wrap gap-6'>
      {actions.map((action: ActionAttributes) => <ActionCard action={action} />)}
    </div>
  )
}

const ActionCard = ({ action }: { action: ActionAttributes }) => {
  const { addAction } = useContext(QueueContext)
  return (
    <button className='hover:scale-x-110 transition-transform duration-200 focus:scale-110' onClick={() => addAction(action.name)}>
      {/* action card */}
      <div className='bg-white flex flex-col rounded h-24 w-24'>
        {/* card name header */}
        <div className='h-8 rounded-t bg-gradient-to-r from-violet-300 to-blue-300 flex justify-center items-center font-bold text-xl text-violet-800'>
          <label>{action.name}</label>
        </div>
        {/* card credits */}
        <div className='h-full  flex justify-center items-center'>
          <label className='text-xl font-bold color'>{action.credits}</label>
        </div>
      </div>

      {/* <button className="h-14 bg-gradient-to-r from-blue-700 to-teal-500 px-6 py-2 rounded-lg  text-xl font-semibold text-white hover:from-purple-700 hover:to-blue-500 transition-all duration-300">Edit profile</button> */}
    </button>
  )

}