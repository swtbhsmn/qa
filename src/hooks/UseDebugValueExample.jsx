import { useDebugValue, useEffect, useState } from 'react'

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  useDebugValue(isOnline ? 'Online' : 'Offline')

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  return isOnline
}

function UseDebugValueExample() {
  const isOnline = useOnlineStatus()

  return (
    <section>
      <h2>useDebugValue: Custom hook label</h2>
      <p>Network status: {isOnline ? 'Online' : 'Offline'}</p>
      <small>Inspect this component in React DevTools to see the debug label.</small>
    </section>
  )
}

export default UseDebugValueExample
