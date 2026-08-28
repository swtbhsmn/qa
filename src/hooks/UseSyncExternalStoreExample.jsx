import { useSyncExternalStore } from 'react'

function subscribe(callback) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getSnapshot() {
  return navigator.onLine
}

function UseSyncExternalStoreExample() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, () => true)

  return (
    <section>
      <h2>useSyncExternalStore: Browser network status</h2>
      <p>You are currently {isOnline ? 'online' : 'offline'}.</p>
    </section>
  )
}

export default UseSyncExternalStoreExample
