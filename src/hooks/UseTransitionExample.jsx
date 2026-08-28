import { useState, useTransition } from 'react'

const items = Array.from({ length: 3000 }, (_, index) => `Item ${index + 1}`)

function UseTransitionExample() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(event) {
    const value = event.target.value
    setInput(value)
    startTransition(() => setQuery(value))
  }

  const matches = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))

  return (
    <section>
      <h2>useTransition: Non-blocking search</h2>
      <input value={input} onChange={handleChange} placeholder="Filter items" />
      <p>{isPending ? 'Updating…' : `${matches.length} matches`}</p>
      <ul>{matches.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  )
}

export default UseTransitionExample
