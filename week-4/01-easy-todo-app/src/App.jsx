import { useEffect, useState } from "react";
const URL = "https://xknrrz-3000.csb.app";
const ROUTE = "/todos";
const todosUrl = URL + ROUTE;

const fetchCall = (url, dataCb, method, data) => {
  const options = {
    method: method ? method : "GET",
    ...(data && {
      headers: { "Content-Type": "application/json" },
      body: data,
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      dataCb(data);
    });
};

const useGetListBroadcast = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    console.log("setInterval called");
    setInterval(() => {
      console.log("fetch called");
      fetchCall(todosUrl, (data) => {
        setList(data);
      });
    }, 1000);
  }, []);

  return list;
};

const handleChange = (setState) => (event) => {
  setState(event.target.value);
};

function App() {
  const list = useGetListBroadcast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addItem = () => {
    const newItem = { title, description };
    fetchCall(todosUrl, (list) => {}, "POST", JSON.stringify(newItem));
  };

  const deleteItem = (id) => {
    fetchCall(`${todosUrl}/${id}`, (list) => {}, "DELETE");
  };

  const updateItem = (item) => {
    const { id } = item;
    fetchCall(`${todosUrl}/${id}`, (list) => {}, "PUT", JSON.stringify(item));
  };

  return (
    <div>
      <label>Title</label>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={handleChange(setTitle)}
      />

      <label>Description</label>
      <input
        type="text"
        placeholder="description"
        value={description}
        onChange={handleChange(setDescription)}
      />

      <button onClick={addItem}>Add todo</button>

      {list.map((item, index) => (
        <div key={index}>
          <span>
            {item.title} {item.description}
          </span>
          &nbsp;
          <button onClick={() => deleteItem(item.id)}>delete</button>
          &nbsp;
          <button
            onClick={() => updateItem({ id: item.id, title, description })}
          >
            update
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
