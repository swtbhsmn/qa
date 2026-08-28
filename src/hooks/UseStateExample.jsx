import { useState } from 'react'

function UseStateExample() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <h2>useState: Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount((value) => value + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </section>
  )
}

export default UseStateExample
