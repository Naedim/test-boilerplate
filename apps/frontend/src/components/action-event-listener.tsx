import { ActionEventResponse} from "@test-boilerplate/responses";
import { ReactNode, useContext, useEffect, useState } from "react";
import { QueueContext } from "../contexts/queueContext";
import * as Toast from '@radix-ui/react-toast';
import { QueueStateData } from "@test-boilerplate/queue";
import { EVENT_ENDPOINT_ACTION, SERVER_URL} from "@test-boilerplate/endpoints";
import './styles.css' //css for the toaster

interface EventToastInfos {
    title: string,
    message: string
}

export const ActionEventListener: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [open, setOpen] = useState<boolean>(false)
    const [toasterInfos, setToasterInfos] = useState<EventToastInfos>({ title: "", message: "" })

    const onEvent = (toastInfos: EventToastInfos) => {
        // console.log("calling onEvent")
        setOpen(false);
        setTimeout(() => {
            setToasterInfos(toastInfos)
            setOpen(true);
        }, 100)
    }

    const { consumeFirstActionCredits, removeActionOccurrences , initData, resetActionsState} = useContext(QueueContext)
    useEffect(() => {

        //init the state of actions and queue
        fetch(SERVER_URL).then(res => {
            // console.log("Contacting server")
            res.json().then((data: QueueStateData) => {
                initData(data)                
            })
        }).then(() => {
            // listen to action events from the server
            const sse = new EventSource(EVENT_ENDPOINT_ACTION)
            sse.onmessage = e => {
                const response: ActionEventResponse = JSON.parse(e.data)

                switch (response.type) {
                    case "consumption":
                        console.log("consumption of ", response.actionName)
                        if (response.actionName) {
                            consumeFirstActionCredits()
                        }
                        onEvent({ title: `Consumed action ${response.actionName}`, message: "" })
                        break;

                    case "noCredits":
                        console.log("nocredit")
                        removeActionOccurrences(response.actionName)
                        onEvent({ title: `No credit for action ${response.actionName}`, message: `Removing all the following ${response.actionName} action from the list` })
                        break;

                    case "reset":
                        resetActionsState(response.actionsList)
                        onEvent({ title: "reset of actions credits", message: "" })
                        break;

                    case "error":
                        onEvent({ title: "Error from the server", message: response.message })
                        break;
                }
            }
        }).catch((err: Error) => {
            console.log("Error while connecting to the server : ", err.message);
        })
    }, [])

    return (

        <>
            <EventToast open={open} onOpenChange={setOpen} infos={toasterInfos} />
            {children}
        </>
    )
}


interface EventToastProps {
    open: boolean,
    onOpenChange: (val: boolean) => void,
    infos: EventToastInfos
}
const EventToast = (props: EventToastProps) => {
    return (
        <>
            <Toast.Root className="ToastRoot" open={props.open} onOpenChange={props.onOpenChange}>
                <Toast.Title className="ToastTitle">{props.infos.title}</Toast.Title>
                <Toast.Description asChild>
                    <div className="ToastDescription">{props.infos.message}</div>
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className="ToastViewport" />
        </>
    )
}