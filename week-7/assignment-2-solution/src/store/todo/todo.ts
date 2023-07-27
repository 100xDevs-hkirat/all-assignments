import {atom} from "recoil"
type TodoItemType = {
    id: number | string;
    title: string;
    description: string;
    done: boolean;
  };
export let todoAtom = atom<Array<TodoItemType>>({
    key:"todoAtom",
    default:[
        {
            id:1,
            title:"Demo",
            description:"this is demo todo",
            done:false
        }
    ]
})