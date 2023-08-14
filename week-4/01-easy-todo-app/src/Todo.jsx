import React from 'react'
import { useRecoilValue } from 'recoil';
import { alltodos } from './components/atom';

const Todo = (props) => {
    const todo = props.todo;
    // Add a delete button here so user can delete a TODO.
    const handleDelete = () => {
        props.delete(todo.id);
    }
    return (<>
        <div onClick={handleDelete} className="todo w-[300px] bg-[#c84e4e] bg-opacity-72 px-5 py-6 m-2 rounded-2xl flex flex-col gap-y-2 justify-center items-center min-w-200 max-w-300 h-auto drop-shadow-2xl transition-shadow" >
            <h1 className='text-3xl font-medium font-sans m-0 p-0 text-center tracking-wide'>{todo.title}</h1>
            <div className='object-contain text-base tracking-normal text-slate-300 line-clamp-2 text-clip overflow-hidden'>{todo.description}</div>
        </div>
    </>
    )
}

export default Todo