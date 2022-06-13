import { h } from "https://cdn.skypack.dev/preact";
import { useState } from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://cdn.skypack.dev/htm";
const html = htm.bind(h);

export const App = () => {
  const [todoContent, setTodoContent] = useState("");
  const [todos, setTodos] = useState(["TODO 1", "TODO 2"]);

  const onAddTodo = () => {
    if (todoContent.length > 0 && todoContent.length <= 140) {
      setTodos([...todos, todoContent]);
      setTodoContent("");
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
      ${todos.map((todo) => html`<li>${todo}</li>`)}
    </ul>
  `;
};
