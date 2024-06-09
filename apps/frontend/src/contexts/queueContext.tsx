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
    resetActionsState: (newActions: ActionState[]) => void;
    initData: (data: QueueStateData) => void;
}>({
    actionsState: [],
    setActionsState: () => [],
    actionsQueue: [],
    setActionsQueue: () => [],
    addAction: () => { return },
    consumeFirstActionCredits: () => { return },
    removeActionOccurrences: () => { return },
    resetActionsState: () => { return },
    initData: () => { return }
});

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
            console.log("couldn't find the action : ", actionName);
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

    const removeActionOccurrences = (actionName: string) => {
            queueRef.current.removeActionOccurrences(actionName);
            setActionsQueue(getActionQueueNames());
    };

    const resetActionsState = (newActions: ActionState[]) => {
        actionsRef.current = newActions.map(ac => new Action(ac.name, ac.credits)) 
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
        <QueueContext.Provider value={{ actionsState, setActionsState, actionsQueue, setActionsQueue, addAction, consumeFirstActionCredits, removeActionOccurrences, resetActionsState, initData }}>
            {children}
        </QueueContext.Provider>
    );
};

