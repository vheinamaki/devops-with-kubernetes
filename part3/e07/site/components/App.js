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
      ${todos.map((todo) => html`<li>${todo.text}</li>`)}
    </ul>
  `;
};
