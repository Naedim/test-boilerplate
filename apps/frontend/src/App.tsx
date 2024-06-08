import { useContext} from 'react';
import { QueueContext } from './contexts/queueContext';
import { ActionCard } from './components/action-card';
import { Queue } from './components/queue';
import { ActionEventListener } from './components/action-event-listener';
import { ActionAttributes } from '@test-boilerplate/queue';

export const App = () => {
  // const [actions, setActions] = useState<Action[]>([])
  // const [queue, setQueue] = useState<Queue>()



  return (
    <ActionEventListener>
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

        {/* main content */}
        <div className='px-4 flex flex-col items-center'>

          {/* action queue */}
          <div className='mt-4 w-full md:w-4/6'>
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
    </div>
    </ActionEventListener>
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