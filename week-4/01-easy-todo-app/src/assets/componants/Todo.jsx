import React from 'react'

function Todo({todoItem, remove}) {
    
  return (
    <div className='todo'>
        <h2>{todoItem.title}</h2>
        <p>{todoItem.description}</p>
        {/* <input type="checkbox" name="compleated" value={todoItem.compleated} /> */}
        <button onClick={()=>remove(todoItem.id)}>DELETE</button>
        <hr />
    </div>
  )
}

export default Todo