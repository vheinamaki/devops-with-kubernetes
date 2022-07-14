import { h } from "https://cdn.skypack.dev/preact";
import { useState, useEffect } from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://cdn.skypack.dev/htm";
const html = htm.bind(h);

const getTodos = () => fetch("/todos").then((res) => res.json());
const postTodo = (text) =>
  fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  }).then((res) => res.json());

const putTodo = (id, text, isCompleted) =>
  fetch(`/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, isCompleted }),
  }).then((res) => res.json());

export const App = () => {
  const [todoContent, setTodoContent] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos().then((res) => {
      setTodos(res);
    });
  }, []);

  const onAddTodo = () => {
    if (todoContent.length > 0 && todoContent.length <= 140) {
      postTodo(todoContent).then((res) => {
        setTodos([...todos, res]);
        setTodoContent("");
      });
    }
  };

  const onCompleteTodo = (todo) => {
    putTodo(todo.id, todo.text, true).then((res) => {
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos([...newTodos, res]);
    });
  };

  return html`
    <div>
      <figure class="picture">
        <img src="/picture" />
      </figure>
    </div>
    <div>
      <input
        maxlength="140"
        type="text"
        value=${todoContent}
        onInput=${(e) => {
          setTodoContent(e.target.value);
        }}
      />
      <button onClick=${onAddTodo}>Add todo</button>
    </div>
    <ul>
      ${todos.map(
        (todo) =>
          html`<li>
            ${todo.text}
            ${todo.isCompleted
              ? html`<b>Done!</b>`
              : html`<button onClick=${() => onCompleteTodo(todo)}>
                  Complete
                </button>`}
          </li>`
      )}
    </ul>
  `;
};
