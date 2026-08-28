import { useEffect, useState } from 'react'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

const technologies = ['React', 'Redux Toolkit', 'React Router', 'Vite', 'TypeScript']

function UseDebounceExample() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const results = technologies.filter((item) =>
    item.toLowerCase().includes(debouncedQuery.toLowerCase()),
  )

  return (
    <section>
      <h2>useDebounce: Delayed search</h2>
      <p>Type quickly. Results update 500ms after you stop.</p>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search technologies" />
      <small>{query !== debouncedQuery ? 'Waiting for input…' : `${results.length} results`}</small>
      <ul>{results.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  )
}

export default UseDebounceExample
