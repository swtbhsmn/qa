import { useEffect, useState } from 'react'

function UseEffectExample() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section>
      <h2>useEffect: Timer subscription</h2>
      <p>This component has been mounted for {seconds} seconds.</p>
    </section>
  )
}

export default UseEffectExample
