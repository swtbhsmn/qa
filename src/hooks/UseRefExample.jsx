import { useRef } from 'react'

function UseRefExample() {
  const inputRef = useRef(null)

  return (
    <section>
      <h2>useRef: Focus a DOM element</h2>
      <input ref={inputRef} placeholder="Click the button to focus me" />
      <button onClick={() => inputRef.current?.focus()}>Focus input</button>
    </section>
  )
}

export default UseRefExample
