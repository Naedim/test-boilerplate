import { ActionAttributes } from "packages/queue/src/lib/action/action";
import { createContext, useState } from "react";

export const QueueContext = createContext<{
    actions: ActionAttributes[];
    setActions: React.Dispatch<React.SetStateAction<ActionAttributes[]>>;
    queue: string[];
    setQueue: React.Dispatch<React.SetStateAction<string[]>>;
    addAction: (actionName: string) => void;
    consumeFirstActionCredits: (actionName: string) => void;
}>({
    actions: [],
    setActions: () => [],
    queue: [],
    setQueue: () => [],
    addAction: () => { return },
    consumeFirstActionCredits: () => { return }
});

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [actions, setActions] = useState<ActionAttributes[]>([]);
    const [queue, setQueue] = useState<string[]>([]);

    const addAction = (actionName: string) => {
        setQueue([...queue, actionName]);
    };

    const consumeFirstActionCredits = (actionName: string) => {

        //removing the first action which name is actionName and all the ones before
        setQueue((prevQueue) => {
            const actionIndex = prevQueue.findIndex((name) => name === actionName);
            const newQueue = prevQueue.slice(actionIndex + 1); // Create a new array
            return newQueue;
        });

        //decreasing the action's credit number
        setActions((prevActions) => {
            const newActions = prevActions
            const concernedAction = newActions.find(ac => ac.name === actionName)
            if (!concernedAction) { 
                console.error(`couldn't find the action when decreasing the credit : ${actionName}`) 
            } else {
                concernedAction.credits--
            }
            return newActions
        })
    };

    return (
        <QueueContext.Provider value={{ actions, setActions, queue, setQueue, addAction, consumeFirstActionCredits }}>
            {children}
        </QueueContext.Provider>
    );
};
