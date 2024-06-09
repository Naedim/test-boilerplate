import { generateQueueAndAction } from "@test-boilerplate/helpers";
import { ActionState, QueueStateData } from "@test-boilerplate/queue";
import { Queue, Action } from "@test-boilerplate/queue";
import { createContext, useState, useRef } from "react";

export const QueueContext = createContext<{
    actionsState: ActionState[];
    setActionsState: React.Dispatch<React.SetStateAction<ActionState[]>>;
    actionsQueue: string[];
    setActionsQueue: React.Dispatch<React.SetStateAction<string[]>>;
    addAction: (actionName: string) => void;
    consumeFirstActionCredits: () => void;
    removeActionOccurrences: (actionName: string) => void;
    resetActionsCredits: (newActions: ActionState[]) => void;
    initData: (data: QueueStateData) => void;
}>({
    actionsState: [],
    setActionsState: () => [],
    actionsQueue: [],
    setActionsQueue: () => [],
    addAction: () => { return },
    consumeFirstActionCredits: () => { return },
    removeActionOccurrences: () => { return },
    resetActionsCredits: () => { return },
    initData: () => { return }
});

/**
 * 
 * Context allowing to share and manipulate the actions and queue states to the entire app 
 * @returns 
 */
export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const actionsRef = useRef<Action[]>([]);
    const queueRef = useRef<Queue>(new Queue());

    const [actionsState, setActionsState] = useState<ActionState[]>([]);
    const [actionsQueue, setActionsQueue] = useState<string[]>([]);

    const getActionQueueNames = (): string[] => {
        return queueRef.current.getList().map(ac => ac.name)
    };

    const getActionsStates = (): ActionState[] => {
        return actionsRef.current.map(ac => ({ name: ac.name, credits: ac.credits }));
    };

    const addAction = (actionName: string) => {
        const action = actionsRef.current.find(ac => ac.name === actionName);
        if (!action) {
            return;
        } else {
            queueRef.current?.addAction(action);
        }
        setActionsQueue(getActionQueueNames());
    };

    const consumeFirstActionCredits = () => {
        queueRef.current.consumeFirstActionCredits();
        setActionsState(getActionsStates());
        setActionsQueue(getActionQueueNames());
    };

    /**
     * 
     * Assure the behavior of skipping to the next action when an initial action lacks credits 
     * @param actionName the action name we want to remove the following occurences of
     *
     * remove all occurences of 'actionName' until another value is found
     */
    const removeActionOccurrences = (actionName: string) => {
        queueRef.current.removeActionOccurrences(actionName);
        setActionsQueue(getActionQueueNames());
        setActionsState(getActionsStates());
    };

    const resetActionsCredits = (newActions: ActionState[]) => {

        //useRef require not to replace the array but to change the original values if needed
        //otherwise actionRef isn't actualized for react
        actionsRef.current.forEach(ac => { 
            const correspondingAction = newActions.find(newAc => newAc.name === ac.name)
            if(correspondingAction){
                ac.credits = correspondingAction.credits 
            }
            else{
                console.error("didn't find corresponding action : ", ac.name)
            }
        })

        setActionsState(getActionsStates())
    };

    const initData = (data: QueueStateData) => {
        const generation = generateQueueAndAction(data, undefined);
        actionsRef.current = generation.actions;
        queueRef.current = generation.queue;
        setActionsState(generation.actions.map(ac => ({ name: ac.name, credits: ac.credits })));
        setActionsQueue(generation.queue.getList().map(ac => ac.name));
    };

    return (
        <QueueContext.Provider value={{ actionsState, setActionsState, actionsQueue, setActionsQueue, addAction, consumeFirstActionCredits, removeActionOccurrences, resetActionsCredits, initData }}>
            {children}
        </QueueContext.Provider>
    );
};

