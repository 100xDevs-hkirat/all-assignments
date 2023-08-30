import { useState , useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './App.css'


function App() {
  const [todos, setTodos] = useState([])
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    // fetch all todos from server
  
  useEffect(() => {
    fetch("http://127.0.0.1:3000/todos").then((res) => {
      res.json().then((data) => {
        setTodos(() =>{
          return data
        })
      })
    })
  } , [])

  const upadateTodo = (event, id) => {
    event.preventDefault();

    // Read the form data
    const form = event.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    const url = "http://127.0.0.1:3000/todos/" + id;
    const options = {
      method: "PUT",
      body: JSON.stringify({
          title: formJson.title,
          description: formJson.description,
          completed: formJson.completed === 'true' ? true : false
      }),
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
    }
    // console.log(formJson)
    // console.log(options)
  
     fetch(url, options).then((res) => {
      res.json().then((data) => {
        setTodos((prevTodos) =>{
          //console.log(prevTodos)
          const newTodos= prevTodos.map((todo) => {
            if(todo.id === data.id){
              return data
            }
            return todo
          })
          //console.log(newTodos)
          return newTodos;
        })
      })
    })
  }

  const deleteTodo = (event, id) => {
    const url = "http://127.0.0.1:3000/todos/" + id;
    const options = {
      method: "DELETE",
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
    }
  
     fetch(url, options).then((res) => {
        setTodos((prevTodos) =>{
          //console.log(prevTodos)
          const newTodos= prevTodos.filter((todo) => {
            if(todo.id === id){
              return false
            }
            return true
          })
          //console.log(newTodos)
          return newTodos;
        })
      })
  }

  const handleSubmit = (e) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    const url = "http://127.0.0.1:3000/todos";
    const options = {
      method: "POST",
      body: JSON.stringify({
          title: formJson.title,
          description: formJson.description,
          completed: false
      }),
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      }
    }
    //console.log(options)
    fetch(url, options).then((res) => {
      res.json().then((data) => {
        setTodos((prevTodos) =>{
          //console.log(prevTodos)
          const newTodos= [...prevTodos, data]
          //console.log(newTodos)
          return newTodos;
        })
        setShow(false)
      })
    })
    //console.log(formJson);
  }


  return (
    <>
      <div style={{ margin: 100 }}>
          <h1 className="centered-h1">Easy Todo App</h1>
          <h3>Add your todos and track them</h3>
          <br />
          <Table striped bordered hover variant="dark">
              <thead>
                  <tr>
                      <th className="text-center">Task ID</th>
                      <th className="text-center">Title</th>
                      <th className="text-center">Description</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Update</th>
                      <th className="text-center">Delete</th>
                  </tr>
              </thead>
              <tbody>
              {todos.map((todo,  i) => {
                 return <Todo 
                    key={i}
                    title={todo.title} 
                    description={todo.description} 
                    completed={todo.completed} 
                    id={todo.id}
                    upadateTodos={event => upadateTodo(event, todo.id)}
                    deleteTodos={event => deleteTodo(event, todo.id)}
                 ></Todo>
              })}
              </tbody>
          </Table>
          <Button variant="primary" onClick={handleShow}>
            Add Todos
          </Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control required type="text" placeholder="Enter Title" name='title'/>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Description</Form.Label>
              <Form.Control required type="text" placeholder="Enter Description" name='description'/>
            </Form.Group>
            <br />
            <Button type="submit">Add Todo</Button>
            <Button variant="secondary" className="float-end" onClick={handleClose}>
              Close
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </>
  )
}

function Todo(props) {
    // Add a delete button here so user can delete a TODO.
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (<>
            <tr>
                <td className="text-center">{props.id}</td>
                <td className="text-center">{props.title}</td>
                <td className="text-center">{props.description}</td>
                {props.completed ? <td className="text-center">Completed</td> : <td className="text-center">Incomplete</td>}
                <td className="text-center"><Button onClick={handleShow} variant="warning">Update</Button></td>
                <td className="text-center"><Button onClick={props.deleteTodos} variant="danger">Delete</Button></td>
            </tr>
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Todo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={props.upadateTodos}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control required type="text" name='title' defaultValue={props.title}/>
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>Description</Form.Label>
                  <Form.Control required type="text" placeholder="Enter Description" name='description' defaultValue={props.description}/>
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Check name="completed" type="radio" value={true} label="Completed" defaultChecked={props.completed} />
                  <Form.Check name="completed" type="radio" value={false} label="Incomplet" defaultChecked={!props.completed} />
                </Form.Group>
                <br />
                <Button type="submit" onClick={handleClose}>Update Todo</Button>
                <Button variant="secondary" className="float-end" onClick={handleClose}>
                  Close
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              
            </Modal.Footer>
          </Modal>
      </>)
}

export default App
