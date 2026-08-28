import { useState } from 'react'
import './App.css'
import {
  UseActionStateExample,
  UseCallbackExample,
  UseContextExample,
  UseDebugValueExample,
  UseDeferredValueExample,
  UseEffectEventExample,
  UseEffectExample,
  UseIdExample,
  UseImperativeHandleExample,
  UseInsertionEffectExample,
  UseLayoutEffectExample,
  UseMemoExample,
  UseOptimisticExample,
  UseReducerExample,
  UseRefExample,
  UseStateExample,
  UseSyncExternalStoreExample,
  UseTransitionExample,
} from './hooks'

const examples = {
  useActionState: { component: UseActionStateExample, definition: 'Manages state for an Action and provides its pending status.', useCase: 'Form submission, validation, and server response feedback.' },
  useCallback: { component: UseCallbackExample, definition: 'Caches a function definition between renders until its dependencies change.', useCase: 'Passing stable callbacks to memoized child components.' },
  useContext: { component: UseContextExample, definition: 'Reads and subscribes to a value from the nearest matching context provider.', useCase: 'Sharing themes, authentication, or settings without prop drilling.' },
  useDebugValue: { component: UseDebugValueExample, definition: 'Adds a readable label to a custom Hook in React DevTools.', useCase: 'Making reusable custom Hooks easier to inspect and debug.' },
  useDeferredValue: { component: UseDeferredValueExample, definition: 'Defers updating a non-critical part of the interface.', useCase: 'Keeping search inputs responsive while rendering large result lists.' },
  useEffect: { component: UseEffectExample, definition: 'Synchronizes a component with systems outside React.', useCase: 'Timers, subscriptions, network connections, and browser APIs.' },
  useEffectEvent: { component: UseEffectEventExample, definition: 'Creates non-reactive logic for an Effect that always reads the latest values.', useCase: 'Using current settings in a connection callback without reconnecting.' },
  useId: { component: UseIdExample, definition: 'Generates a unique, stable identifier for the component instance.', useCase: 'Connecting labels, inputs, hints, and other accessible elements.' },
  useImperativeHandle: { component: UseImperativeHandleExample, definition: 'Customizes the methods and values exposed through a ref.', useCase: 'Giving a parent controlled focus, clear, or scroll methods.' },
  useInsertionEffect: { component: UseInsertionEffectExample, definition: 'Runs before layout Effects so libraries can insert dynamic styles.', useCase: 'CSS-in-JS libraries that must inject styles before layout measurement.' },
  useLayoutEffect: { component: UseLayoutEffectExample, definition: 'Runs after DOM layout but before the browser paints the screen.', useCase: 'Measuring and positioning tooltips without visible flicker.' },
  useMemo: { component: UseMemoExample, definition: 'Caches a calculated value until one of its dependencies changes.', useCase: 'Avoiding repeated expensive filtering or data transformations.' },
  useOptimistic: { component: UseOptimisticExample, definition: 'Temporarily shows an expected result while an Action is completing.', useCase: 'Displaying a sent message immediately while it uploads.' },
  useReducer: { component: UseReducerExample, definition: 'Manages state by dispatching actions to a reducer function.', useCase: 'Handling related state transitions with predictable logic.' },
  useRef: { component: UseRefExample, definition: 'Stores a mutable value that does not trigger rendering when changed.', useCase: 'Accessing DOM elements or preserving timer and instance values.' },
  useState: { component: UseStateExample, definition: 'Adds a state value and an updater function to a component.', useCase: 'Counters, toggles, form values, and other local UI state.' },
  useSyncExternalStore: { component: UseSyncExternalStoreExample, definition: 'Subscribes safely to a store whose data is managed outside React.', useCase: 'Reading browser status, third-party stores, or shared data sources.' },
  useTransition: { component: UseTransitionExample, definition: 'Marks an update as non-blocking and exposes its pending state.', useCase: 'Keeping urgent interactions responsive during expensive rendering.' },
}

function App() {
  const [selectedHook, setSelectedHook] = useState('useState')
  const selectedExample = examples[selectedHook]
  const SelectedExample = selectedExample.component

  return (
    <main className="examples-app">
      <aside className="examples-sidebar">
        <h1>React Hooks</h1>
        <nav aria-label="Hook examples">
          {Object.keys(examples).map((hook) => (
            <button
              key={hook}
              type="button"
              className={selectedHook === hook ? 'active' : ''}
              onClick={() => setSelectedHook(hook)}
            >
              {hook}
            </button>
          ))}
        </nav>
      </aside>

      <div className="example-content">
        <div className="example-shell">
          <header className="example-header">
            <span className="example-kicker">React hook</span>
            <h2>{selectedHook}</h2>
            <p>{selectedExample.definition}</p>
            <div className="use-case">
              <strong>Common use case</strong>
              <span>{selectedExample.useCase}</span>
            </div>
          </header>

          <div className="example-demo" key={selectedHook}>
            <SelectedExample />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
