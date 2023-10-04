import './App.css'
import TodosFetcher from './components/FetchTodos'
import CreateNewTodo from './components/SendTodos'
import "./App.css"
function App() {
  

  return (
    <>
      <div className="app-container">
      <div className="header">
        <h1 className="title">MANAGE YOUR TODOS</h1>
      </div>
      <div className="form-container">
        <CreateNewTodo />
      </div>
      <div className="list-container">
        <TodosFetcher />
      </div>
    </div>
    </>
  )
}

// function Todo(props) {
//     // Add a delete button here so user can delete a TODO.
//     return <div>
//         {props.title}
//     </div>
// }

export default App
