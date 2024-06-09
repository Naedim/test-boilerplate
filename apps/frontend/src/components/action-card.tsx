import axios from "axios";
import { useContext } from "react";
import { AddActionPayload } from "@test-boilerplate/payloads"
import { ActionState } from "packages/queue/src/lib/action/action";
import { QueueContext } from "../contexts/queueContext";
import { ACTION_ENDPOINT_ADD } from "@test-boilerplate/endpoints";
export const ActionCard = ({ action }: { action: ActionState }) => {
  const { addAction } = useContext(QueueContext)

  const manageAddAction = (actionName: string) => {
    const payload: AddActionPayload = { actionName: actionName }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios.post(ACTION_ENDPOINT_ADD, payload, config).then(() => {
      addAction(actionName)
    }).catch((err) => console.error(err)
    )
  }
  return (
    <button className='hover:scale-x-110 transition-transform duration-200 focus:scale-110' onClick={() => manageAddAction(action.name)}>
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
    </button>
  )

}