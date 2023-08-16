import './Todo.css';

export default function Todo({
  title,
  completed,
  description,
  handleChange,
  handleDelete,
}) {
  // Add a delete button here so user can delete a TODO.

  return (
    <div className="todo">
      <input
        type="checkbox"
        checked={completed}
        onChange={handleChange}
      />
      <p className={`${completed && 'done'}`}>{title}</p>
      <p className={`${completed && 'done'}`}>{description}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

Todo.prototype;
