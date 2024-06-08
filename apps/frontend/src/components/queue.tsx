import { useContext } from "react"
import { QueueContext } from "../contexts/queueContext"

export const Queue = () => {
  const { queue } = useContext(QueueContext)

  return (
    <div className='h-72 bg-gradient-to-r from-violet-300 to-blue-300 rounded-3xl p-4 flex flex-wrap gap-4 gap-y-1 overflow-auto scroll-m-2'>

      {queue.map((actionName, index) => {
        return <QueueAction key={index} actionName={actionName} />
      })}
    </div>
  )
}


const QueueAction = ({ actionName }: { actionName: string }) => {
  return (
    <div className='h-10 w-10 bg-white rounded flex justify-center items-center'>
      <label className='text-black text-lg font-bold'>{actionName}</label>
    </div>
  )
}