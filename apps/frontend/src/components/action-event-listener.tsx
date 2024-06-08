import { NoCreditRemaining } from "@test-boilerplate/errors";
import { QueueStateResponse, ConsumeActionResponse } from "@test-boilerplate/responses";
import { ReactElement, ReactNode, useContext, useEffect } from "react";
import { QueueContext } from "../contexts/queueContext";

export const ActionEventListener: React.FC<{ children: ReactNode }> = ({ children }) => {

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
                        if (response.actionName) {
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

    return children as ReactElement 

}