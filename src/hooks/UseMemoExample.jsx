import { useMemo, useState } from 'react'

const numbers = Array.from({ length: 1000 }, (_, index) => index + 1)

function UseMemoExample() {
  const [minimum, setMinimum] = useState(990)
  const filteredNumbers = useMemo(
    () => numbers.filter((number) => number >= minimum),
    [minimum],
  )

  return (
    <section>
      <h2>useMemo: Cached filtering</h2>
      <input type="number" value={minimum} onChange={(event) => setMinimum(Number(event.target.value))} />
      <p>Results: {filteredNumbers.join(', ')}</p>
    </section>
  )
}

export default UseMemoExample
