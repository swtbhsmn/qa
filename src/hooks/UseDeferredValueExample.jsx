import { useDeferredValue, useMemo, useState } from 'react'

const products = Array.from({ length: 500 }, (_, index) => `Product ${index + 1}`)

function UseDeferredValueExample() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(
    () => products.filter((product) => product.toLowerCase().includes(deferredQuery.toLowerCase())),
    [deferredQuery],
  )

  return (
    <section>
      <h2>useDeferredValue: Search results</h2>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
      <p>{results.length} matches {query !== deferredQuery && '(updating…)'}</p>
      <ul>{results.slice(0, 5).map((product) => <li key={product}>{product}</li>)}</ul>
    </section>
  )
}

export default UseDeferredValueExample
