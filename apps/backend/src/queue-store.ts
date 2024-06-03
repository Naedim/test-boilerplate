import { Queue } from "packages/queue/src/lib/queue/queue";
import { Action } from "vite-plugin-checker/dist/esm/types";
class Store {
    private static instance: Store;
    public actions : Action[];
    public queue: Queue;

    private initData(){
        //way of getting data
    }
    private constructor() {
    }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }


}

export default Store.getInstance();