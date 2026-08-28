import { memo, useCallback, useState } from 'react'

const TodoList = memo(function TodoList({ todos, onRemove }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button type="button" onClick={() => onRemove(todo.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
})

function UseCallbackExample() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn useCallback' },
    { id: 2, text: 'Keep callback references stable' },
  ])
  const [theme, setTheme] = useState('light')
  const [nextId, setNextId] = useState(3)

  const removeTodo = useCallback((id) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id),
    )
  }, [])

  function addTodo(formData) {
    const text = formData.get('todo')?.toString().trim()

    if (!text) return

    setTodos((currentTodos) => [...currentTodos, { id: nextId, text }])
    setNextId((id) => id + 1)
  }

  return (
    <section className={`callback-card ${theme}`}>
      <span className="eyebrow">React hook</span>
      <h1>useCallback</h1>
      <p className="intro">
        The remove handler keeps the same reference when unrelated state changes,
        helping the memoized list avoid unnecessary renders.
      </p>

      <form action={addTodo} className="todo-form">
        <input name="todo" placeholder="Add a task" aria-label="New task" />
        <button type="submit">Add task</button>
      </form>

      {todos.length > 0 ? (
        <TodoList todos={todos} onRemove={removeTodo} />
      ) : (
        <p className="empty-state">All tasks completed.</p>
      )}

      <button
        className="theme-button"
        type="button"
        onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>

      <div className="hook-signature">
        <code>const removeTodo = useCallback((id) =&gt; &#123; ... &#125;, [])</code>
      </div>
    </section>
  )
}

export default UseCallbackExample
