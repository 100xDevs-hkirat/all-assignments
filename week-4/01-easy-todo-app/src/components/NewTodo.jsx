import { useState } from 'react';

export default function NewTodo({ createTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    createTodo({ title, description, completed: false }, () => {
      setTitle('');
      setDescription('');
    });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        name="title"
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}></input>
      <input
        name="description"
        type="text"
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}></input>
      <button type="submit">Submit</button>
    </form>
  );
}
