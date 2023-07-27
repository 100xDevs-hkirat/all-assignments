import {atom} from "recoil"
type TodoItemType = {
    _id:  string;
    title: string;
    description: string;
    done: boolean;
  };
export let todoAtom = atom<Array<TodoItemType>>({
    key:"todoAtom",
    default:[
        {
            _id:"",
            title:"Demo",
            description:"this is demo todo",
            done:false
        }
    ]
})