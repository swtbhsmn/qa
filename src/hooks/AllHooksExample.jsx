import {
  createContext,
  forwardRef,
  useActionState,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react'

const hooks = [
  'useActionState', 'useCallback', 'useContext', 'useDebugValue',
  'useDeferredValue', 'useEffect', 'useEffectEvent', 'useId',
  'useImperativeHandle', 'useInsertionEffect', 'useLayoutEffect', 'useMemo',
  'useOptimistic', 'useReducer', 'useRef', 'useState',
  'useSyncExternalStore', 'useTransition',
]

const descriptions = {
  useActionState: 'Manage the result and pending state of a form action.',
  useCallback: 'Cache a function between renders.',
  useContext: 'Read and subscribe to context from a component.',
  useDebugValue: 'Add a readable label to a custom hook in React DevTools.',
  useDeferredValue: 'Let a non-critical part of the UI update later.',
  useEffect: 'Synchronize a component with an external system.',
  useEffectEvent: 'Read the latest values from an Effect without re-running it.',
  useId: 'Generate stable IDs for accessible relationships.',
  useImperativeHandle: 'Customize the handle exposed through a ref.',
  useInsertionEffect: 'Insert dynamic styles before layout Effects run.',
  useLayoutEffect: 'Measure layout before the browser repaints.',
  useMemo: 'Cache the result of an expensive calculation.',
  useOptimistic: 'Show an immediate result while an Action completes.',
  useReducer: 'Manage state with reducer logic and dispatched actions.',
  useRef: 'Keep a mutable value or reference a DOM element.',
  useState: 'Add a state variable to a component.',
  useSyncExternalStore: 'Subscribe to data stored outside React.',
  useTransition: 'Render part of the UI in the background.',
}

const ThemeContext = createContext('dark')

function subscribeToOnlineStatus(callback) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getOnlineStatus() {
  return navigator.onLine
}

function getServerOnlineStatus() {
  return true
}

function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineStatus,
    getServerOnlineStatus,
  )
  useDebugValue(isOnline ? 'Online' : 'Offline')
  return isOnline
}

const SmartInput = forwardRef(function SmartInput({ id }, ref) {
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus()
    },
    clear() {
      if (inputRef.current) inputRef.current.value = ''
    },
  }), [])

  return <input id={id} ref={inputRef} placeholder="Controlled through an imperative handle" />
})

function counterReducer(count, action) {
  if (action === 'increment') return count + 1
  if (action === 'decrement') return count - 1
  return 0
}

async function saveName(_previousState, formData) {
  const name = formData.get('name')?.toString().trim()
  await new Promise((resolve) => setTimeout(resolve, 500))
  return name ? `Saved “${name}”` : 'Please enter a name.'
}

function HooksPlayground() {
  const theme = useContext(ThemeContext)
  const [selectedHook, setSelectedHook] = useState('useState')
  const [count, dispatch] = useReducer(counterReducer, 0)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('All')
  const inputId = useId()
  const inputRef = useRef(null)
  const measureRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [actionMessage, formAction, actionPending] = useActionState(saveName, '')
  const [messages, setMessages] = useState(['React hooks are composable.'])
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (current, message) => [...current, `${message} (sending…)`],
  )
  const isOnline = useOnlineStatus()

  const filteredHooks = useMemo(
    () => hooks.filter((hook) => hook.toLowerCase().includes(deferredQuery.toLowerCase())),
    [deferredQuery],
  )

  const selectHook = useCallback((hook) => {
    setSelectedHook(hook)
  }, [])

  const onIntervalTick = useEffectEvent(() => {
    setSeconds((value) => value + 1)
  })

  useEffect(() => {
    const interval = setInterval(() => onIntervalTick(), 1000)
    return () => clearInterval(interval)
  }, [])

  useInsertionEffect(() => {
    const style = document.createElement('style')
    style.textContent = '.insertion-effect-chip { outline: 2px solid #2dd4bf; }'
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  useLayoutEffect(() => {
    if (!measureRef.current) return
    setWidth(Math.round(measureRef.current.getBoundingClientRect().width))
  }, [selectedHook])

  async function sendOptimisticMessage(formData) {
    const message = formData.get('message')?.toString().trim()
    if (!message) return
    addOptimisticMessage(message)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setMessages((current) => [...current, message])
  }

  return (
    <main className={`hooks-app ${theme}`}>
      <aside className="hooks-sidebar">
        <div className="hooks-brand">React <span>Hooks</span></div>
        <input
          className="hooks-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter hooks…"
          aria-label="Filter hooks"
        />
        <nav aria-label="React hooks">
          {filteredHooks.map((hook) => (
            <button
              key={hook}
              type="button"
              className={selectedHook === hook ? 'active' : ''}
              onClick={() => selectHook(hook)}
            >
              {hook}
            </button>
          ))}
        </nav>
      </aside>

      <section className="hooks-content">
        <header>
          <p>React API reference</p>
          <h1>{selectedHook}</h1>
          <span>{descriptions[selectedHook]}</span>
        </header>

        <div className="hooks-grid" ref={measureRef}>
          <article className="demo-panel featured">
            <div className="panel-title">
              <span>Live playground</span>
              <em className="insertion-effect-chip">{isOnline ? 'Online' : 'Offline'}</em>
            </div>
            <p>This panel is {width}px wide and has been open for {seconds}s.</p>

            <div className="counter-row">
              <button onClick={() => dispatch('decrement')}>−</button>
              <strong>{count}</strong>
              <button onClick={() => dispatch('increment')}>+</button>
              <button onClick={() => dispatch('reset')}>Reset</button>
            </div>

            <label htmlFor={inputId}>Accessible input generated with useId</label>
            <SmartInput id={inputId} ref={inputRef} />
            <div className="inline-actions">
              <button onClick={() => inputRef.current?.focus()}>Focus</button>
              <button onClick={() => inputRef.current?.clear()}>Clear</button>
            </div>
          </article>

          <article className="demo-panel">
            <div className="panel-title"><span>Action state</span></div>
            <form action={formAction} className="compact-form">
              <input name="name" placeholder="Your name" aria-label="Your name" />
              <button disabled={actionPending}>{actionPending ? 'Saving…' : 'Save'}</button>
            </form>
            <p className="result-text">{actionMessage || 'Submit the form to update action state.'}</p>
          </article>

          <article className="demo-panel">
            <div className="panel-title"><span>Optimistic messages</span></div>
            <ul className="message-list">
              {optimisticMessages.map((message, index) => <li key={`${message}-${index}`}>{message}</li>)}
            </ul>
            <form action={sendOptimisticMessage} className="compact-form">
              <input name="message" placeholder="Write a message" />
              <button>Send</button>
            </form>
          </article>

          <article className="demo-panel">
            <div className="panel-title"><span>Transition</span><em>{isPending ? 'Updating…' : 'Ready'}</em></div>
            <div className="tab-row">
              {['All', 'Active', 'Done'].map((nextTab) => (
                <button
                  key={nextTab}
                  className={tab === nextTab ? 'active' : ''}
                  onClick={() => startTransition(() => setTab(nextTab))}
                >
                  {nextTab}
                </button>
              ))}
            </div>
            <p>Current background-rendered view: <strong>{tab}</strong></p>
          </article>
        </div>
      </section>
    </main>
  )
}

function AllHooksExample() {
  return (
    <ThemeContext.Provider value="dark">
      <HooksPlayground />
    </ThemeContext.Provider>
  )
}

export default AllHooksExample
