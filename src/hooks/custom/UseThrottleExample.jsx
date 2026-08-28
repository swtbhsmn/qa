import { useEffect, useRef, useState } from 'react'

function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdated = useRef(0)

  useEffect(() => {
    const elapsed = Date.now() - lastUpdated.current
    const remaining = Math.max(delay - elapsed, 0)
    const timer = setTimeout(() => {
      setThrottledValue(value)
      lastUpdated.current = Date.now()
    }, remaining)

    return () => clearTimeout(timer)
  }, [value, delay])

  return throttledValue
}

function UseThrottleExample() {
  const [position, setPosition] = useState(0)
  const throttledPosition = useThrottle(position, 400)

  return (
    <section>
      <h2>useThrottle: Limited updates</h2>
      <p>Move the slider quickly. The displayed value updates at most once every 400ms.</p>
      <input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} />
      <p>Immediate: <strong>{position}</strong> · Throttled: <strong>{throttledPosition}</strong></p>
    </section>
  )
}

export default UseThrottleExample
