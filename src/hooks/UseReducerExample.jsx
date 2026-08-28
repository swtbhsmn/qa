import { useReducer } from 'react'

function reducer(state, action) {
  if (action.type === 'increment') return { count: state.count + 1 }
  if (action.type === 'decrement') return { count: state.count - 1 }
  return { count: 0 }
}

function UseReducerExample() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  return (
    <section>
      <h2>useReducer: Counter actions</h2>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'decrement' })}>−</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </section>
  )
}

export default UseReducerExample
