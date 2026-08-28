import { useEffect, useEffectEvent, useState } from 'react'

function UseEffectEventExample() {
  const [roomId, setRoomId] = useState('general')
  const [theme, setTheme] = useState('light')
  const [status, setStatus] = useState('Connecting…')
  const [connections, setConnections] = useState(0)

  const onConnected = useEffectEvent((connectedRoom) => {
    setStatus(
      `Connected to #${connectedRoom} using the latest ${theme} theme.`,
    )
  })

  useEffect(() => {
    const connectionTimer = setTimeout(() => {
      setConnections((count) => count + 1)
      onConnected(roomId)
    }, 700)

    return () => clearTimeout(connectionTimer)
  }, [roomId])

  return (
    <section className={`effect-event-card ${theme}`}>
      <span className="eyebrow">React 19.2 hook</span>
      <h1>useEffectEvent</h1>
      <p className="intro">
        Changing rooms reconnects the effect. Changing the theme does not, but the
        connection callback still reads the latest theme.
      </p>

      <div className="demo-controls">
        <label htmlFor="room">Chat room</label>
        <select
          id="room"
          value={roomId}
          onChange={(event) => {
            const nextRoom = event.target.value
            setStatus(`Connecting to #${nextRoom}…`)
            setRoomId(nextRoom)
          }}
        >
          <option value="general">#general</option>
          <option value="react">#react</option>
          <option value="random">#random</option>
        </select>

        <button
          type="button"
          onClick={() =>
            setTheme((current) => (current === 'light' ? 'dark' : 'light'))
          }
        >
          Use {theme === 'light' ? 'dark' : 'light'} theme
        </button>
      </div>

      <div className="connection-status" role="status">
        <span className="status-dot" aria-hidden="true" />
        <div>
          <strong>{status}</strong>
          <small>Connection effect runs: {connections}</small>
        </div>
      </div>

      <div className="hook-signature">
        <code>const onConnected = useEffectEvent(() =&gt; notify(theme))</code>
      </div>
    </section>
  )
}

export default UseEffectEventExample
