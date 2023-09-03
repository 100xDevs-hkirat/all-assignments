function TodoLi(todos) {
    return <> 
    {todos.map(todo => {
        return <>
        <li>
            <span>{todo.title}</span>
            <span>{todo.description}</span>
            <span>{todo.id}</span>
        </li>
        </>
    })}
    </>
}

export default TodoLi