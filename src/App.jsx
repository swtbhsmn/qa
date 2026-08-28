import { useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import './App.css'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Separator } from './components/ui/separator'
import {
  UseActionStateExample, UseCallbackExample, UseContextExample,
  UseDebugValueExample, UseDeferredValueExample, UseEffectEventExample,
  UseEffectExample, UseIdExample, UseImperativeHandleExample,
  UseInsertionEffectExample, UseLayoutEffectExample, UseMemoExample,
  UseOptimisticExample, UseReducerExample, UseRefExample, UseStateExample,
  UseSyncExternalStoreExample, UseTransitionExample,
} from './hooks'
import UseDebounceExample from './hooks/custom/UseDebounceExample'
import UseFetchExample from './hooks/custom/UseFetchExample'
import UseThrottleExample from './hooks/custom/UseThrottleExample'
import dsaMarkdown from '../dsa_strings_javascript.md?raw'

const sourceFiles = import.meta.glob('./hooks/**/Use*Example.jsx', {
  eager: true,
  import: 'default',
  query: '?raw',
})

function toSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const dsaMetadata = {
  1: { group: 'Sliding Window', hint: 'Keep a left boundary and move it past the previous position of any repeated character.' },
  2: { group: 'Stack', hint: 'Store indices, begin with -1, and reset the base index whenever the stack becomes empty.' },
  3: { group: 'Frequency Map', hint: 'Count every character in the first string, then subtract counts while reading the second.' },
  4: { group: 'Frequency Map', hint: 'Words that are anagrams need the same stable key. Try a sorted word or a 26-letter count.' },
  5: { group: 'Frequency Map', hint: 'Use one pass to count characters and a second pass to preserve their original order.' },
  6: { group: 'Linear Scan', hint: 'Track the current run length. Append it when the next character is different.' },
  7: { group: 'Two Pointers', hint: 'Compare characters from both ends and move both pointers toward the center.' },
  8: { group: 'Two Pointers', hint: 'Normalize the text first, then apply the same two-pointer palindrome check.' },
  9: { group: 'Expand Around Center', hint: 'Every palindrome has a center. Expand around each odd and even center.' },
  10: { group: 'Sliding Window', hint: 'Calculate the first window once, then subtract the outgoing value and add the incoming value.' },
  11: { group: 'Sliding Window', hint: 'Expand until the target is reached, then shrink from the left while the window remains valid.' },
  12: { group: 'Frequency Map', hint: 'Count occurrences while tracking which character currently has the largest count.' },
  13: { group: 'Frequency Map', hint: 'Count each character, then keep only entries whose count is greater than one.' },
  14: { group: 'Two Pointers', hint: 'Because the array is sorted, move left up for a small sum and right down for a large sum.' },
  15: { group: 'Two Pointers', hint: 'Let one pointer scan and another mark where the next unique value should be written.' },
  16: { group: 'Math / XOR', hint: 'Compare the expected range with the actual values using either a sum difference or XOR.' },
  17: { group: 'Cycle Detection', hint: 'Treat each value as the next pointer. The duplicate creates a cycle that slow and fast pointers can find.' },
  18: { group: 'Hash Set', hint: 'Only begin counting from a number that has no predecessor in the set.' },
}

const patternMemory = {
  'Sliding Window': 'Imagine a window moving across a row of houses. Add what enters from the right and remove what leaves from the left.',
  Stack: 'Imagine a stack of plates: the last plate placed on top is the first one removed.',
  'Frequency Map': 'Think of making tally marks on paper. Every value gets its own counter.',
  'Linear Scan': 'Walk through the list once while carrying only the information needed for the current run.',
  'Two Pointers': 'Imagine two people walking toward each other from opposite ends, or one fast person and one slow person moving forward.',
  'Expand Around Center': 'Drop a pebble at every possible center and watch equal characters ripple outward on both sides.',
  'Math / XOR': 'Compare what should exist with what actually exists. The unmatched value is the answer.',
  'Cycle Detection': 'Picture runners on a circular track. The fast runner eventually catches the slow runner inside the loop.',
  'Hash Set': 'Use a checklist for instant “have I seen this?” answers instead of searching the whole list again.',
}

const dsaQuestions = dsaMarkdown
  .split(/^## (?=\d+\.)/m)
  .slice(1)
  .map((section) => {
    const [heading] = section.split('\n')
    const match = heading.match(/^(\d+)\.\s+(.+)$/)
    const codeBlocks = [...section.matchAll(/```js\n([\s\S]*?)```/g)].map((item) => item[1].trim())
    const pattern = section.match(/- \*\*Pattern:\*\*\s*(.+)/)?.[1] || 'Problem solving'
    const time = section.match(/- \*\*Time:\*\*\s*(.+)/)?.[1] || 'See implementation'
    const space = section.match(/- \*\*Space:\*\*\s*(.+)/)?.[1] || 'See implementation'
    const title = match[2]
    const metadata = dsaMetadata[Number(match[1])]

    return {
      number: Number(match[1]),
      title,
      slug: toSlug(title),
      pattern: metadata?.group || pattern,
      group: metadata?.group || pattern,
      hint: metadata?.hint || 'Start with the brute-force approach, then identify repeated work you can avoid.',
      time,
      space,
      code: codeBlocks.join('\n\n// Alternative solution\n\n'),
    }
  })

const dsaQuestionGroups = Object.entries(
  dsaQuestions.reduce((groups, question) => {
    groups[question.group] = [...(groups[question.group] || []), question]
    return groups
  }, {}),
).map(([pattern, questions]) => ({ pattern, questions }))

const hookPages = [
  ['useActionState', UseActionStateExample, 'Manages the result and pending state of a form Action.', 'Forms and server mutations'],
  ['useCallback', UseCallbackExample, 'Caches a function until its dependencies change.', 'Stable callbacks for memoized children'],
  ['useContext', UseContextExample, 'Reads a value from the nearest context provider.', 'Themes, auth, and shared settings'],
  ['useDebugValue', UseDebugValueExample, 'Adds a readable DevTools label to a custom Hook.', 'Debugging reusable custom Hooks'],
  ['useDeferredValue', UseDeferredValueExample, 'Defers a non-critical UI update.', 'Responsive search result rendering'],
  ['useEffect', UseEffectExample, 'Synchronizes a component with an external system.', 'Timers, connections, and subscriptions'],
  ['useEffectEvent', UseEffectEventExample, 'Extracts non-reactive logic from an Effect.', 'Reading latest values without reconnecting'],
  ['useId', UseIdExample, 'Generates stable IDs for accessible relationships.', 'Labels, inputs, and descriptions'],
  ['useImperativeHandle', UseImperativeHandleExample, 'Customizes the API exposed through a ref.', 'Focus, clear, and scroll controls'],
  ['useInsertionEffect', UseInsertionEffectExample, 'Inserts styles before layout Effects run.', 'CSS-in-JS library internals'],
  ['useLayoutEffect', UseLayoutEffectExample, 'Measures layout before the browser repaints.', 'Tooltip and popover positioning'],
  ['useMemo', UseMemoExample, 'Caches a calculated value between renders.', 'Expensive filtering and transformations'],
  ['useOptimistic', UseOptimisticExample, 'Shows an expected result while an Action completes.', 'Instant message and mutation feedback'],
  ['useReducer', UseReducerExample, 'Updates state by dispatching actions to a reducer.', 'Complex related state transitions'],
  ['useRef', UseRefExample, 'Stores a mutable value without causing a render.', 'DOM access and instance values'],
  ['useState', UseStateExample, 'Adds local state to a component.', 'Inputs, counters, and toggles'],
  ['useSyncExternalStore', UseSyncExternalStoreExample, 'Subscribes safely to an external data store.', 'Browser APIs and shared stores'],
  ['useTransition', UseTransitionExample, 'Marks an update as non-blocking.', 'Keeping expensive UI updates responsive'],
].map(([name, component, definition, useCase]) => ({ name, component, definition, useCase }))

const customHookPages = [
  { name: 'useDebounce', component: UseDebounceExample, definition: 'Returns a value only after it has stopped changing for a specified delay.', useCase: 'Search inputs, validation, and autosave where only the final value matters.', filename: 'UseDebounceExample.jsx' },
  { name: 'useThrottle', component: UseThrottleExample, definition: 'Limits how often a rapidly changing value can update.', useCase: 'Scroll, resize, pointer movement, and other high-frequency events.', filename: 'UseThrottleExample.jsx' },
  { name: 'useFetch', component: UseFetchExample, definition: 'Encapsulates data fetching, loading, errors, and request cleanup.', useCase: 'Reusing basic API request behavior across multiple components.', filename: 'UseFetchExample.jsx' },
]

const stateApproaches = [
  { number: '01', title: 'Local component state', hooks: ['useState'], description: 'Keep simple values close to the component that owns them.', example: 'Inputs, toggles, counters, and modal visibility.' },
  { number: '02', title: 'Reducer state', hooks: ['useReducer'], description: 'Centralize related state transitions in a reducer with named actions.', example: 'Multi-step forms, carts, editors, and complex workflows.' },
  { number: '03', title: 'Shared context state', hooks: ['useContext', 'useState'], description: 'Provide state to a section of the component tree without passing props through every level.', example: 'Theme, locale, authentication, and app preferences.' },
  { number: '04', title: 'External store state', hooks: ['useSyncExternalStore'], description: 'Subscribe React to state managed by a browser API or third-party store.', example: 'Redux-like stores, network status, and shared caches.' },
  { number: '05', title: 'URL state', hooks: [], description: 'Store navigation-related state in route paths or search parameters.', example: 'Filters, pagination, selected tabs, and shareable searches.' },
  { number: '06', title: 'Action and optimistic state', hooks: ['useActionState', 'useOptimistic'], description: 'Track mutations and show the expected result while asynchronous work completes.', example: 'Form submissions, comments, likes, and messages.' },
  { number: '07', title: 'Derived state', hooks: ['useMemo'], description: 'Calculate values from existing state instead of storing duplicate state.', example: 'Filtered lists, totals, sorting, and formatted data.' },
]

const reduxCoreExample = `import { createStore } from 'redux'

const INCREMENT = 'counter/increment'

function reducer(state = { value: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 }
    default:
      return state
  }
}

const store = createStore(reducer)
store.dispatch({ type: INCREMENT })`

const reduxToolkitExample = `import { configureStore, createSlice } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => {
      state.value += 1
    }
  }
})

const store = configureStore({
  reducer: { counter: counter.reducer }
})

store.dispatch(counter.actions.increment())`

const middlewareExample = `const logger = store => next => action => {
  console.log('dispatching', action)

  const result = next(action)

  console.log('next state', store.getState())
  return result
}`

const tanstackQueryExample = `import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

async function getTodos() {
  const response = await fetch('/api/todos')
  if (!response.ok) throw new Error('Failed to load todos')
  return response.json()
}

function Todos() {
  const { data, isPending, error, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    staleTime: 60_000,
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p>{error.message}</p>

  return (
    <>
      {isFetching && <small>Refreshing…</small>}
      <ul>{data.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}`

const functionMethodsExample = `const user = {
  name: 'Ada',
  introduce(greeting, punctuation) {
    return \`${'${greeting}'}, I am ${'${this.name}'}${'${punctuation}'}\`
  }
}

const guest = { name: 'Grace' }

// call: run now; arguments are passed one by one
user.introduce.call(guest, 'Hello', '!')

// apply: run now; arguments are passed in an array
user.introduce.apply(guest, ['Hello', '!'])

// bind: create a new function to run later
const introduceGrace = user.introduce.bind(guest, 'Hello')
introduceGrace('!')`

const eventDelegationExample = `const list = document.querySelector('#todo-list')

// One listener on the parent handles every current and future button.
list.addEventListener('click', event => {
  const button = event.target.closest('[data-remove]')

  if (!button || !list.contains(button)) return

  button.closest('li').remove()
})

// This new item needs no separate click listener.
list.insertAdjacentHTML(
  'beforeend',
  '<li>New task <button data-remove>Remove</button></li>'
)`

function Sidebar() {
  const [query, setQuery] = useState('')
  const [isHooksOpen, setIsHooksOpen] = useState(true)
  const [isCustomHooksOpen, setIsCustomHooksOpen] = useState(true)
  const [isCodeOpen, setIsCodeOpen] = useState(false)
  const filtered = useMemo(
    () => hookPages.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <aside className="site-sidebar">
      <NavLink className="site-logo" to="/hooks/useState">
        <span className="logo-mark">R</span>
        <span>React Hooks<small>shadcn/ui examples</small></span>
      </NavLink>
      <NavLink className="compare-nav-link" to="/compare">
        <span>Compare hooks</span><span aria-hidden="true">⇄</span>
      </NavLink>
      <div className="guides-nav-group">
        <span className="nav-group-label">Guides</span>
        <NavLink className="guide-nav-link" to="/guides/state-management">
          <span>State management</span><span aria-hidden="true">›</span>
        </NavLink>
        <NavLink className="guide-nav-link" to="/guides/redux">
          <span>Redux</span><span aria-hidden="true">›</span>
        </NavLink>
        <NavLink className="guide-nav-link" to="/guides/tanstack-query">
          <span>React Query</span><span aria-hidden="true">›</span>
        </NavLink>
        <NavLink className="guide-nav-link" to="/guides/javascript-qa">
          <span>JavaScript Q&amp;A</span><span aria-hidden="true">›</span>
        </NavLink>
      </div>

      <div className="hooks-nav-group">
        <button
          type="button"
          className="hooks-nav-trigger"
          onClick={() => setIsHooksOpen((open) => !open)}
          aria-expanded={isHooksOpen}
          aria-controls="hooks-navigation"
        >
          <span>Hooks <small>{hookPages.length}</small></span>
          <span className={isHooksOpen ? 'chevron open' : 'chevron'} aria-hidden="true">›</span>
        </button>

        {isHooksOpen && (
          <div id="hooks-navigation" className="hooks-nav-content">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hooks…" aria-label="Search hooks" />
            <nav aria-label="Hook examples">
              {filtered.map(({ name }) => (
                <NavLink key={name} to={`/hooks/${name}`} className={({ isActive }) => isActive ? 'active' : ''}>
                  <span>{name}</span><span aria-hidden="true">›</span>
                </NavLink>
              ))}
              {filtered.length === 0 && <p className="empty-navigation">No hooks found.</p>}
            </nav>
          </div>
        )}
      </div>

      <div className="custom-hooks-nav-group">
        <button
          type="button"
          className="hooks-nav-trigger"
          onClick={() => setIsCustomHooksOpen((open) => !open)}
          aria-expanded={isCustomHooksOpen}
          aria-controls="custom-hooks-navigation"
        >
          <span>Custom Hooks <small>{customHookPages.length}</small></span>
          <span className={isCustomHooksOpen ? 'chevron open' : 'chevron'} aria-hidden="true">›</span>
        </button>
        {isCustomHooksOpen && (
          <nav id="custom-hooks-navigation" className="custom-hooks-navigation" aria-label="Custom hook examples">
            {customHookPages.map(({ name }) => (
              <NavLink key={name} to={`/custom-hooks/${name}`} className={({ isActive }) => isActive ? 'active' : ''}>
                <span>{name}</span><span aria-hidden="true">›</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="code-nav-group">
        <button
          type="button"
          className="hooks-nav-trigger"
          onClick={() => setIsCodeOpen((open) => !open)}
          aria-expanded={isCodeOpen}
          aria-controls="code-navigation"
        >
          <span>Code <small>{dsaQuestions.length}</small></span>
          <span className={isCodeOpen ? 'chevron open' : 'chevron'} aria-hidden="true">›</span>
        </button>
        {isCodeOpen && (
          <nav id="code-navigation" className="code-navigation" aria-label="DSA coding questions">
            {dsaQuestionGroups.map((group) => (
              <div className="code-pattern-group" key={group.pattern}>
                <span className="code-pattern-label">{group.pattern}<small>{group.questions.length}</small></span>
                {group.questions.map((question) => (
                  <NavLink key={question.slug} to={`/code/${question.slug}`} className={({ isActive }) => isActive ? 'active' : ''} aria-label={`Question ${question.number}: ${question.title}`}>
                    <span className="code-nav-label"><small>{question.number}</small><span>{question.title}</span></span>
                    <span className="nav-info" data-tooltip={question.title} aria-label={`Full title: ${question.title}`} role="img" tabIndex="0">i</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>
    </aside>
  )
}

function HeaderNavigation() {
  const { pathname } = useLocation()
  const hookName = pathname.split('/').filter(Boolean).at(-1)
  const isComparePage = pathname === '/compare'
  const isGuidePage = pathname === '/guides/state-management'
  const isReduxGuide = pathname === '/guides/redux'
  const isQueryGuide = pathname === '/guides/tanstack-query'
  const isQaGuide = pathname === '/guides/javascript-qa'
  const isAnyGuide = isGuidePage || isReduxGuide || isQueryGuide || isQaGuide
  const isCustomHookPage = pathname.startsWith('/custom-hooks/')
  const customHookName = isCustomHookPage ? hookName : null
  const isCodePage = pathname.startsWith('/code/')
  const codeSlug = isCodePage ? hookName : null
  const codeQuestion = dsaQuestions.find((question) => question.slug === codeSlug)
  const index = hookPages.findIndex(({ name }) => name === hookName)
  const previous = index > 0 ? hookPages[index - 1] : null
  const next = index >= 0 && index < hookPages.length - 1 ? hookPages[index + 1] : null

  return (
    <header className="site-header">
      <div className="header-location">
        <Link to="/hooks/useState">Hooks</Link>
        <span aria-hidden="true">/</span>
        <strong>{isComparePage ? 'Compare' : isGuidePage ? 'Managing state' : isReduxGuide ? 'Redux' : isQueryGuide ? 'React Query' : isQaGuide ? 'JavaScript Q&A' : codeQuestion?.title || customHookName || (index >= 0 ? hookPages[index].name : 'React')}</strong>
      </div>
      <nav className="header-actions" aria-label="Page navigation">
        <Link to="/compare" className={isComparePage ? 'active' : ''}>Compare</Link>
        <Link to="/guides/state-management" className={isGuidePage ? 'active' : ''}>State guide</Link>
        {!isComparePage && !isAnyGuide && !isCustomHookPage && !isCodePage && <>
        {previous ? (
          <Link to={`/hooks/${previous.name}`} aria-label={`Previous: ${previous.name}`}>
            <span aria-hidden="true">←</span><span className="header-link-label">Previous</span>
          </Link>
        ) : <span />}
        {next && (
          <Link to={`/hooks/${next.name}`} aria-label={`Next: ${next.name}`}>
            <span className="header-link-label">Next</span><span aria-hidden="true">→</span>
          </Link>
        )}
        </>}
      </nav>
    </header>
  )
}

function CodeQuestionPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const index = dsaQuestions.findIndex((question) => question.slug === slug)
  if (index === -1) return <Navigate to={`/code/${dsaQuestions[0].slug}`} replace />

  const question = dsaQuestions[index]
  const previous = dsaQuestions[index - 1]
  const next = dsaQuestions[index + 1]

  return (
    <div className="hook-page code-question-page">
      <div className="breadcrumb"><span>Code</span><span>/</span><strong>Question {question.number}</strong></div>
      <header className="page-heading code-heading">
        <Badge>JavaScript DSA</Badge>
        <h1>{question.title}</h1>
        <p>Interview-ready solution from the Strings &amp; Arrays question bank.</p>
      </header>

      <div className="complexity-grid">
        <Card><CardHeader><CardTitle>Pattern</CardTitle><CardDescription>{question.pattern}</CardDescription></CardHeader></Card>
        <Card><CardHeader><CardTitle>Time</CardTitle><CardDescription>{question.time}</CardDescription></CardHeader></Card>
        <Card><CardHeader><CardTitle>Space</CardTitle><CardDescription>{question.space}</CardDescription></CardHeader></Card>
      </div>

      <Card className="solution-hint-card">
        <CardContent>
          <span className="hint-icon" aria-hidden="true">?</span>
          <div className="hint-content">
            <strong>Easy hint</strong>
            <p>{question.hint}</p>
            <div className="memory-tip">
              <span>Picture it</span>
              <p>{patternMemory[question.group]}</p>
            </div>
            <div className="recall-tip">
              <span>How to remember after solving</span>
              <ol>
                <li>Say the clue: <b>“{question.title} → {question.group}.”</b></li>
                <li>Close the solution and explain the pointer or data-structure movement aloud.</li>
                <li>Write only the code skeleton again tomorrow, then after three days.</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="code-card dsa-editor-card">
        <CardHeader className="code-header">
          <div><CardTitle>JavaScript solution</CardTitle><CardDescription>dsa_strings_javascript.md · Question {question.number}</CardDescription></div>
          <Badge>JavaScript</Badge>
        </CardHeader>
        <Separator />
        <div className="monaco-shell">
          <Editor height="620px" language="javascript" path={`dsa-${question.slug}.js`} theme="vs-dark" value={question.code} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, lineHeight: 22, padding: { top: 18, bottom: 18 }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }} />
        </div>
      </Card>

      <footer className="page-navigation">
        {previous ? <Button variant="outline" onClick={() => navigate(`/code/${previous.slug}`)}>← Question {previous.number}</Button> : <span />}
        {next && <Button onClick={() => navigate(`/code/${next.slug}`)}>Question {next.number} →</Button>}
      </footer>
    </div>
  )
}

function CustomHookPage() {
  const { hookName } = useParams()
  const page = customHookPages.find((item) => item.name === hookName)
  if (!page) return <Navigate to="/custom-hooks/useDebounce" replace />

  const Example = page.component
  const source = sourceFiles[`./hooks/custom/${page.filename}`]

  return (
    <div className="hook-page custom-hook-page">
      <div className="breadcrumb"><span>Custom Hooks</span><span>/</span><strong>{page.name}</strong></div>
      <header className="page-heading">
        <Badge>Custom Hook</Badge>
        <h1>{page.name}</h1>
        <p>{page.definition}</p>
      </header>

      <div className="page-grid">
        <Card>
          <CardHeader><CardTitle>Interactive example</CardTitle><CardDescription>Try the custom hook’s behavior.</CardDescription></CardHeader>
          <Separator />
          <CardContent className="example-stage"><Example /></CardContent>
        </Card>
        <aside className="details-column">
          <Card><CardHeader><CardTitle>Use case</CardTitle><CardDescription>{page.useCase}</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle>Important</CardTitle></CardHeader><CardContent><p className="custom-hook-note">Custom Hooks reuse stateful logic—not state itself. Every component call gets independent state.</p></CardContent></Card>
        </aside>
      </div>

      <Card className="code-card">
        <CardHeader className="code-header"><div><CardTitle>Source code</CardTitle><CardDescription>src/hooks/custom/{page.filename}</CardDescription></div><Badge>JSX</Badge></CardHeader>
        <Separator />
        <div className="monaco-shell">
          <Editor height="540px" language="javascript" path={`custom-${page.filename}`} theme="vs-dark" value={source} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, lineHeight: 22, padding: { top: 18, bottom: 18 }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }} />
        </div>
      </Card>
    </div>
  )
}

function StateManagementGuide() {
  return (
    <div className="hook-page state-guide">
      <div className="breadcrumb"><span>Guides</span><span>/</span><strong>Managing state</strong></div>
      <header className="page-heading guide-heading">
        <Badge>React guide</Badge>
        <h1>How to manage state in React</h1>
        <p>React applications commonly use seven approaches. Choose based on who owns the data, how complex its updates are, and whether it must survive or be shared.</p>
      </header>

      <Card className="guide-summary">
        <CardContent>
          <strong>Quick answer</strong>
          <span><b>7 common approaches</b> cover local, reducer, context, external, URL, asynchronous, and derived state.</span>
        </CardContent>
      </Card>

      <Card className="state-flow-card">
        <CardHeader>
          <CardTitle>How state management works</CardTitle>
          <CardDescription>State is a component’s memory. Updating it asks React to calculate and commit a new interface.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="state-flow" aria-label="React state update flow">
            <div><span>1</span><strong>Event</strong><small>A user or external system triggers an update.</small></div>
            <b aria-hidden="true">→</b>
            <div><span>2</span><strong>Update</strong><small>A setter or dispatch queues the next state.</small></div>
            <b aria-hidden="true">→</b>
            <div><span>3</span><strong>Render</strong><small>React calls components using the new state snapshot.</small></div>
            <b aria-hidden="true">→</b>
            <div><span>4</span><strong>Commit</strong><small>React applies the necessary DOM changes.</small></div>
          </div>

          <div className="state-rules">
            <div><strong>State is a snapshot</strong><p>Each render receives its own fixed state values. A setter schedules the next render; it does not change the current one.</p></div>
            <div><strong>Updates are queued</strong><p>React batches updates from the same event. Use an updater such as <code>setCount(c =&gt; c + 1)</code> when the next value depends on the previous one.</p></div>
            <div><strong>Ownership matters</strong><p>Keep state in the closest common owner of every component that reads or changes it.</p></div>
            <div><strong>Treat state as immutable</strong><p>Create new objects and arrays instead of mutating existing state so React can detect the change reliably.</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="interview-card">
        <CardHeader>
          <div className="interview-title-row">
            <Badge>Interview ready</Badge>
            <span>30-second answer</span>
          </div>
          <CardTitle>How do you manage state in React?</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <blockquote>
            “I keep state as close as possible to the components that use it. For simple local state I use <strong>useState</strong>, and for complex transitions I use <strong>useReducer</strong>. When multiple components need the same state, I lift it to their closest common parent or share it with <strong>Context</strong>. For state outside React I use <strong>useSyncExternalStore</strong>, and I keep shareable navigation state in the URL. I avoid duplicated state by deriving values during render, and I update objects and arrays immutably.”
          </blockquote>

          <div className="interview-points">
            <div>
              <strong>Key phrases to include</strong>
              <ul>
                <li>Single source of truth</li>
                <li>Lift state up when it must be shared</li>
                <li>State updates are queued and batched</li>
                <li>Never mutate state directly</li>
              </ul>
            </div>
            <div>
              <strong>Likely follow-ups</strong>
              <ul>
                <li>When would you choose useReducer?</li>
                <li>Context versus an external store?</li>
                <li>Why use functional state updates?</li>
                <li>What causes a component to re-render?</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="approaches-grid">
        {stateApproaches.map((approach) => (
          <Card key={approach.number} className="approach-card">
            <CardHeader>
              <span className="approach-number">{approach.number}</span>
              <CardTitle>{approach.title}</CardTitle>
              <CardDescription>{approach.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="approach-hooks">
                {approach.hooks.length > 0 ? approach.hooks.map((hook) => (
                  <Link key={hook} to={`/hooks/${hook}`}>{hook}</Link>
                )) : <Badge>React Router</Badge>}
              </div>
              <p><strong>Use it for:</strong> {approach.example}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="decision-card">
        <CardHeader>
          <CardTitle>Which one should you choose?</CardTitle>
          <CardDescription>Start with the smallest tool that owns the state correctly.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <ol>
            <li><strong>Used by one component?</strong> Start with <Link to="/hooks/useState">useState</Link>.</li>
            <li><strong>Many related transitions?</strong> Move to <Link to="/hooks/useReducer">useReducer</Link>.</li>
            <li><strong>Needed by a subtree?</strong> Combine state with <Link to="/hooks/useContext">useContext</Link>.</li>
            <li><strong>Already stored outside React?</strong> Subscribe with <Link to="/hooks/useSyncExternalStore">useSyncExternalStore</Link>.</li>
            <li><strong>Should be shareable or survive refresh?</strong> Put it in the URL or persistent storage.</li>
            <li><strong>Comes from other state?</strong> Derive it during render; use <Link to="/hooks/useMemo">useMemo</Link> only when the calculation is expensive.</li>
          </ol>
        </CardContent>
      </Card>

      <aside className="state-warning">
        <strong>A ref is not rendering state.</strong>
        <p><Link to="/hooks/useRef">useRef</Link> preserves mutable data, but changing it does not re-render the interface.</p>
      </aside>
    </div>
  )
}

function ReduxGuide() {
  return (
    <div className="hook-page redux-guide">
      <div className="breadcrumb"><span>Guides</span><span>/</span><strong>Redux</strong></div>
      <header className="page-heading guide-heading">
        <Badge>State management</Badge>
        <h1>Redux, explained</h1>
        <p>Redux is a predictable state container for shared application state. In modern apps, Redux logic should be written with Redux Toolkit and connected to React through React-Redux.</p>
      </header>

      <div className="redux-intro-grid">
        <Card>
          <CardHeader><span className="approach-number">01</span><CardTitle>What is Redux?</CardTitle></CardHeader>
          <CardContent><p>Redux keeps global state in a centralized store. Components read selected values and dispatch actions describing what happened. Reducers calculate the next state.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><span className="approach-number">02</span><CardTitle>Why was it introduced?</CardTitle></CardHeader>
          <CardContent><p>As applications grew, shared state and updates spread across distant components became difficult to trace. Redux introduced strict update rules, one-way data flow, and predictable state changes.</p></CardContent>
        </Card>
      </div>

      <Card className="redux-question-card">
        <CardHeader>
          <Badge>Common question</Badge>
          <CardTitle>If React has hooks, why use Redux?</CardTitle>
          <CardDescription>Hooks and Redux solve overlapping but different scopes of state management.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="hooks-redux-compare">
            <div><strong>React hooks</strong><p>Best for local component state, nearby shared state, and UI behavior. They are built into React and usually require less setup.</p><ul><li>Form values and toggles</li><li>Component-specific state</li><li>Small shared state through Context</li></ul></div>
            <div><strong>Redux Toolkit</strong><p>Useful when substantial state is shared across distant features and needs consistent updates, middleware, caching, or powerful debugging.</p><ul><li>Large cross-feature state</li><li>Traceable action history</li><li>Complex async workflows and caching</li></ul></div>
          </div>
          <aside className="redux-rule"><strong>Rule of thumb:</strong> Start with React state. Add Redux when centralized state and its tooling solve a real coordination problem—not simply because the app uses React.</aside>
        </CardContent>
      </Card>

      <Card className="redux-flow-card">
        <CardHeader><CardTitle>How Redux works</CardTitle><CardDescription>Redux follows a predictable one-way data flow.</CardDescription></CardHeader>
        <Separator />
        <CardContent>
          <div className="redux-flow">
            <div><span>1</span><strong>UI</strong><small>A user performs an action.</small></div><b>→</b>
            <div><span>2</span><strong>Dispatch</strong><small>The component dispatches an action object.</small></div><b>→</b>
            <div><span>3</span><strong>Reducer</strong><small>The reducer calculates the next state.</small></div><b>→</b>
            <div><span>4</span><strong>Store</strong><small>The store saves state and notifies subscribers.</small></div><b>→</b>
            <div><span>5</span><strong>Re-render</strong><small>Subscribed components read updated values.</small></div>
          </div>
        </CardContent>
      </Card>

      <div className="redux-pieces-grid">
        {[
          ['Store', 'The single object that holds the application state.'],
          ['Action', 'A plain object describing an event, such as cart/itemAdded.'],
          ['Reducer', 'A function that calculates state changes from the current state and an action.'],
          ['Dispatch', 'The store method used to send an action into the update flow.'],
          ['Selector', 'A function that reads or derives a specific value from store state.'],
          ['Middleware', 'Logic that handles side effects, logging, and async workflows.'],
        ].map(([title, description]) => <Card key={title}><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>)}
      </div>

      <Card className="middleware-card">
        <CardHeader>
          <Badge>Redux concept</Badge>
          <CardTitle>What is middleware?</CardTitle>
          <CardDescription>Middleware is code that runs after an action is dispatched but before it reaches the reducer.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="middleware-flow">
            <div><strong>Component</strong><small>dispatch(action)</small></div>
            <span>→</span>
            <div className="middleware-step"><strong>Middleware</strong><small>inspect · delay · transform · handle</small></div>
            <span>→</span>
            <div><strong>Reducer</strong><small>calculate next state</small></div>
            <span>→</span>
            <div><strong>Store</strong><small>notify the UI</small></div>
          </div>

          <div className="middleware-details">
            <div>
              <strong>What middleware can do</strong>
              <ul>
                <li>Run asynchronous logic and dispatch later</li>
                <li>Log actions and resulting state</li>
                <li>Report errors or analytics events</li>
                <li>Cancel, delay, or dispatch additional actions</li>
              </ul>
            </div>
            <div>
              <strong>Common middleware</strong>
              <ul>
                <li><b>Redux Thunk:</b> functions with sync or async logic</li>
                <li><b>Listener middleware:</b> react to actions or state changes</li>
                <li><b>RTK Query:</b> data fetching and cache lifecycle</li>
                <li><b>Logger:</b> inspect actions during development</li>
              </ul>
            </div>
          </div>

          <div className="middleware-code">
            <div>
              <span>Conceptual middleware</span>
              <div className="redux-monaco-editor">
                <Editor
                  height="260px"
                  language="javascript"
                  path="logger-middleware.js"
                  theme="vs-dark"
                  value={middlewareExample}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, automaticLayout: true }}
                />
              </div>
            </div>
            <aside>
              <strong>Why not put this in a reducer?</strong>
              <p>Reducers must stay predictable and calculate state only. Network requests, timers, logging, and other side effects belong outside reducers—often in middleware.</p>
            </aside>
          </div>
        </CardContent>
      </Card>

      <Card className="modern-redux-card">
        <CardHeader><Badge>Recommended today</Badge><CardTitle>Use Redux Toolkit</CardTitle><CardDescription>Redux Toolkit is the Redux maintainers’ official approach for new Redux code.</CardDescription></CardHeader>
        <Separator />
        <CardContent>
          <div className="modern-redux-editor">
            <div className="editor-file-label">src/features/counter/counterSlice.js</div>
            <div className="redux-monaco-editor">
              <Editor
                height="390px"
                language="javascript"
                path="modern-redux-toolkit-counter.js"
                theme="vs-dark"
                value={reduxToolkitExample}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }}
              />
            </div>
          </div>
          <p>In React components, use <code>useSelector</code> to read state and <code>useDispatch</code> to send actions.</p>
        </CardContent>
      </Card>

      <Card className="core-toolkit-card">
        <CardHeader>
          <Badge>Side-by-side</Badge>
          <CardTitle>Redux Core vs Redux Toolkit</CardTitle>
          <CardDescription>Both use the same Redux principles. Redux Toolkit provides the recommended APIs and defaults around Redux Core.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="redux-api-comparison">
            <div>
              <div className="comparison-heading"><strong>Redux Core</strong><Badge>Low-level</Badge></div>
              <p>Provides the fundamental store primitives and leaves most decisions and setup to you.</p>
              <ul>
                <li><code>createStore</code> creates a store</li>
                <li><code>combineReducers</code> combines reducers</li>
                <li><code>applyMiddleware</code> installs middleware</li>
                <li>You write action types and immutable updates manually</li>
              </ul>
            </div>
            <div>
              <div className="comparison-heading"><strong>Redux Toolkit</strong><Badge>Recommended</Badge></div>
              <p>Wraps Redux Core with good defaults and utilities that reduce repetition and common mistakes.</p>
              <ul>
                <li><code>configureStore</code> sets up the store and DevTools</li>
                <li><code>createSlice</code> creates reducers and actions together</li>
                <li>Thunk middleware is configured by default</li>
                <li>Immer safely produces immutable updates</li>
              </ul>
            </div>
          </div>

          <div className="redux-code-comparison">
            <div>
              <span>Redux Core counter <code>src/store.js</code></span>
              <div className="redux-monaco-editor">
                <Editor
                  height="390px"
                  language="javascript"
                  path="redux-core-counter.js"
                  theme="vs-dark"
                  value={reduxCoreExample}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }}
                />
              </div>
            </div>
            <div>
              <span>Redux Toolkit counter <code>src/features/counter/counterSlice.js</code></span>
              <div className="redux-monaco-editor">
                <Editor
                  height="390px"
                  language="javascript"
                  path="redux-toolkit-counter.js"
                  theme="vs-dark"
                  value={reduxToolkitExample}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }}
                />
              </div>
            </div>
          </div>

          <div className="redux-file-layout">
            <div className="file-tree">
              <strong>Recommended file structure</strong>
              <pre>{`src/
├── app/
│   └── store.js              # configureStore
├── features/
│   └── counter/
│       ├── counterSlice.js   # state + reducers + actions
│       └── Counter.jsx       # useSelector + useDispatch
└── main.jsx                  # <Provider store={store}>`}</pre>
            </div>
            <div className="file-responsibilities">
              <strong>What goes where?</strong>
              <dl>
                <div><dt>store.js</dt><dd>Creates and exports the Redux store.</dd></div>
                <div><dt>*Slice.js</dt><dd>Defines initial state, reducers, and generated actions for one feature.</dd></div>
                <div><dt>main.jsx</dt><dd>Wraps the React application with the React-Redux Provider.</dd></div>
                <div><dt>Component.jsx</dt><dd>Reads state with useSelector and dispatches actions with useDispatch.</dd></div>
              </dl>
            </div>
          </div>

          <aside className="toolkit-recommendation">
            <strong>Which should you use?</strong>
            <p>Learn Redux Core concepts so you understand stores, actions, and reducers. For production and new Redux code, use Redux Toolkit. The Redux maintainers describe the standalone legacy core setup as obsolete for new applications.</p>
          </aside>
        </CardContent>
      </Card>

      <Card className="interview-card">
        <CardHeader><div className="interview-title-row"><Badge>Interview ready</Badge><span>30-second answer</span></div><CardTitle>Why would you use Redux?</CardTitle></CardHeader>
        <Separator />
        <CardContent><blockquote>“Redux provides predictable, centralized state management through one-way data flow. React hooks are usually enough for local state, but Redux becomes valuable when state is shared across many distant features, update logic is complex, or the team needs middleware and action-based debugging. For new code, I use Redux Toolkit because it reduces boilerplate and includes the recommended defaults.”</blockquote></CardContent>
      </Card>

      <div className="official-links">
        <a href="https://redux.js.org/tutorials/essentials/part-1-overview-concepts" target="_blank" rel="noreferrer">Redux concepts ↗</a>
        <a href="https://redux.js.org/introduction/why-rtk-is-redux-today" target="_blank" rel="noreferrer">Why Redux Toolkit ↗</a>
      </div>
    </div>
  )
}

function TanStackQueryGuide() {
  return (
    <div className="hook-page query-guide">
      <div className="breadcrumb"><span>Guides</span><span>/</span><strong>React Query</strong></div>
      <header className="page-heading guide-heading">
        <Badge>Server state</Badge>
        <h1>React Query, explained</h1>
        <p>TanStack Query—formerly React Query—is a library for fetching, caching, synchronizing, and updating asynchronous server data in React applications.</p>
      </header>

      <div className="query-intro-grid">
        <Card><CardHeader><span className="approach-number">01</span><CardTitle>What is it?</CardTitle></CardHeader><CardContent><p>It manages the full lifecycle of server state: loading, errors, caching, freshness, retries, background refetching, and mutations.</p></CardContent></Card>
        <Card><CardHeader><span className="approach-number">02</span><CardTitle>Why is it used?</CardTitle></CardHeader><CardContent><p>Manual fetching with effects becomes repetitive and does not automatically deduplicate requests, share cached results, or keep remote data fresh.</p></CardContent></Card>
      </div>

      <Card className="query-benefits-card">
        <CardHeader><CardTitle>What problem does it solve?</CardTitle><CardDescription>Server state behaves differently from local UI state.</CardDescription></CardHeader>
        <Separator />
        <CardContent>
          <div className="query-benefits">
            {[
              ['Cache', 'Reuse data across components by its query key.'],
              ['Deduplicate', 'Avoid duplicate requests for the same active query.'],
              ['Refetch', 'Refresh stale data on mount, focus, or reconnection.'],
              ['Retry', 'Retry failed client queries with backoff by default.'],
              ['Mutations', 'Create, update, or delete server data.'],
              ['Invalidate', 'Mark related cached data stale and fetch it again.'],
            ].map(([title, text]) => <div key={title}><strong>{title}</strong><p>{text}</p></div>)}
          </div>
        </CardContent>
      </Card>

      <Card className="query-flow-card">
        <CardHeader><CardTitle>How React Query works</CardTitle><CardDescription>A query key identifies cached server data.</CardDescription></CardHeader>
        <Separator />
        <CardContent>
          <div className="query-flow">
            <div><span>1</span><strong>Component</strong><small>calls useQuery</small></div><b>→</b>
            <div><span>2</span><strong>Query cache</strong><small>checks the query key</small></div><b>→</b>
            <div><span>3</span><strong>Query function</strong><small>fetches when needed</small></div><b>→</b>
            <div><span>4</span><strong>Cache update</strong><small>stores the response</small></div><b>→</b>
            <div><span>5</span><strong>Subscribers</strong><small>re-render with data</small></div>
          </div>
        </CardContent>
      </Card>

      <Card className="query-choice-card">
        <CardHeader><CardTitle>useFetch vs React Query vs Redux</CardTitle></CardHeader>
        <Separator />
        <CardContent>
          <div className="query-choice-grid">
            <div><strong>Custom useFetch</strong><p>Good for learning or a small number of simple requests. You own caching, retries, race conditions, and invalidation.</p></div>
            <div><strong>TanStack Query</strong><p>Best for server state that must be cached, shared, refreshed, mutated, and synchronized.</p></div>
            <div><strong>Redux Toolkit</strong><p>Best for centralized client state and complex event-driven workflows. RTK Query can manage server data inside Redux.</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="code-card query-code-card">
        <CardHeader className="code-header"><div><CardTitle>Basic query example</CardTitle><CardDescription>src/features/todos/Todos.jsx</CardDescription></div><Badge>JSX</Badge></CardHeader>
        <Separator />
        <div className="monaco-shell"><Editor height="610px" language="javascript" path="tanstack-query-example.jsx" theme="vs-dark" value={tanstackQueryExample} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 18, bottom: 18 }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }} /></div>
      </Card>

      <Card className="interview-card">
        <CardHeader><div className="interview-title-row"><Badge>Interview ready</Badge><span>30-second answer</span></div><CardTitle>Why use React Query?</CardTitle></CardHeader>
        <Separator />
        <CardContent><blockquote>“React Query manages server state rather than local UI state. It gives queries stable cache keys and handles loading, errors, request deduplication, retries, stale data, background refetching, mutations, and cache invalidation. I use it when remote data is shared or must stay synchronized, instead of rebuilding those behaviors with useEffect and useState.”</blockquote></CardContent>
      </Card>

      <div className="official-links">
        <a href="https://tanstack.com/query/latest/docs/framework/react/quick-start" target="_blank" rel="noreferrer">Official quick start ↗</a>
        <a href="https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults" target="_blank" rel="noreferrer">Important defaults ↗</a>
      </div>
    </div>
  )
}

function JavaScriptQaGuide() {
  return (
    <div className="hook-page qa-guide">
      <div className="breadcrumb"><span>Guides</span><span>/</span><strong>JavaScript Q&amp;A</strong></div>
      <header className="page-heading guide-heading">
        <Badge>Interview questions</Badge>
        <h1>JavaScript Q&amp;A</h1>
        <p>Clear comparisons, practical use cases, and examples for commonly confused JavaScript concepts.</p>
      </header>

      <Card className="qa-topic-card">
        <CardHeader><Badge>Question 01</Badge><CardTitle>What is the difference between call, apply, and bind?</CardTitle><CardDescription>All three control the value of <code>this</code> for a function. Their timing and argument format are different.</CardDescription></CardHeader>
        <Separator />
        <CardContent>
          <div className="method-comparison">
            <div><strong>call</strong><Badge>Runs now</Badge><p>Invokes the function immediately and accepts arguments separately.</p><code>fn.call(thisValue, arg1, arg2)</code></div>
            <div><strong>apply</strong><Badge>Runs now</Badge><p>Invokes the function immediately and accepts arguments inside an array.</p><code>fn.apply(thisValue, [arg1, arg2])</code></div>
            <div><strong>bind</strong><Badge>Runs later</Badge><p>Returns a new function with a fixed <code>this</code> value and optional preset arguments.</p><code>const bound = fn.bind(thisValue)</code></div>
          </div>

          <div className="qa-use-cases">
            <div><strong>Use call when</strong><p>You want to borrow a method and invoke it immediately with known individual arguments.</p></div>
            <div><strong>Use apply when</strong><p>Your arguments already exist as an array or array-like collection.</p></div>
            <div><strong>Use bind when</strong><p>You need a callback for later and must preserve its object context.</p></div>
          </div>

          <div className="qa-editor">
            <div className="editor-file-label">bind-call-apply.js</div>
            <div className="redux-monaco-editor"><Editor height="390px" language="javascript" path="bind-call-apply.js" theme="vs-dark" value={functionMethodsExample} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, automaticLayout: true }} /></div>
          </div>

          <aside className="qa-memory"><strong>Easy memory trick:</strong><span><b>C</b>all = <b>C</b>ommas, <b>A</b>pply = <b>A</b>rray, <b>B</b>ind = <b>B</b>ack later.</span></aside>
        </CardContent>
      </Card>

      <Card className="qa-topic-card">
        <CardHeader><Badge>Question 02</Badge><CardTitle>Event delegation vs propagation vs bubbling</CardTitle><CardDescription>Propagation is the complete journey. Bubbling is one phase. Delegation is a pattern that uses bubbling.</CardDescription></CardHeader>
        <Separator />
        <CardContent>
          <div className="event-concepts">
            <div><strong>Event propagation</strong><p>The full path an event follows through the DOM: capturing down, target, then bubbling up.</p></div>
            <div><strong>Event bubbling</strong><p>The phase where an event travels from the target element upward through its ancestors.</p></div>
            <div><strong>Event delegation</strong><p>A technique that puts one listener on a parent and identifies which child triggered the bubbled event.</p></div>
          </div>

          <div className="event-flow" aria-label="DOM event propagation phases">
            <div><span>1</span><strong>Capture</strong><small>window → parent → target</small></div><b>→</b>
            <div><span>2</span><strong>Target</strong><small>event reaches clicked element</small></div><b>→</b>
            <div><span>3</span><strong>Bubble</strong><small>target → parent → window</small></div>
          </div>

          <div className="delegation-benefits">
            <strong>Why use event delegation?</strong>
            <ul><li>Fewer event listeners and lower memory usage</li><li>Dynamically added children work automatically</li><li>Related event logic stays in one parent handler</li></ul>
          </div>

          <div className="qa-editor">
            <div className="editor-file-label">event-delegation.js</div>
            <div className="redux-monaco-editor"><Editor height="390px" language="javascript" path="event-delegation.js" theme="vs-dark" value={eventDelegationExample} options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, automaticLayout: true }} /></div>
          </div>

          <aside className="qa-memory"><strong>Easy memory trick:</strong><span>Propagation is the whole trip, bubbling is the trip upward, and delegation is the parent using that upward trip.</span></aside>
        </CardContent>
      </Card>

      <Card className="interview-card">
        <CardHeader><div className="interview-title-row"><Badge>Interview ready</Badge><span>Short answer</span></div><CardTitle>How should I explain event delegation?</CardTitle></CardHeader>
        <Separator />
        <CardContent><blockquote>“Event propagation describes an event moving through capture, target, and bubble phases. Bubbling is specifically the upward phase from the target to its ancestors. Event delegation is a coding pattern that takes advantage of bubbling by attaching one listener to a parent and using event.target or closest() to handle matching children.”</blockquote></CardContent>
      </Card>
    </div>
  )
}

function ComparisonColumn({ page }) {
  const Example = page.component
  const filename = `${page.name[0].toUpperCase()}${page.name.slice(1)}Example.jsx`
  const source = sourceFiles[`./hooks/${filename}`]

  return (
    <div className="comparison-column">
      <Card>
        <CardHeader>
          <Badge>React Hook</Badge>
          <CardTitle>{page.name}</CardTitle>
          <CardDescription>{page.definition}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <strong className="comparison-label">Best for</strong>
          <p className="comparison-use-case">{page.useCase}</p>
          <code>import &#123; {page.name} &#125; from 'react'</code>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live behavior</CardTitle>
          <CardDescription>Interact with this hook’s example.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="example-stage comparison-demo"><Example /></CardContent>
      </Card>

      <Card>
        <CardHeader className="code-header">
          <div><CardTitle>Source</CardTitle><CardDescription>{filename}</CardDescription></div>
          <Badge>JSX</Badge>
        </CardHeader>
        <Separator />
        <div className="monaco-shell">
          <Editor
            height="420px"
            language="javascript"
            path={`compare-${filename}`}
            theme="vs-dark"
            value={source}
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 21, padding: { top: 16 }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }}
          />
        </div>
      </Card>
    </div>
  )
}

function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const leftName = searchParams.get('left') || 'useState'
  const rightName = searchParams.get('right') || 'useReducer'
  const left = hookPages.find((page) => page.name === leftName) || hookPages[15]
  const right = hookPages.find((page) => page.name === rightName) || hookPages[13]

  function updateSide(side, name) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set(side, name)
    setSearchParams(nextParams)
  }

  return (
    <div className="hook-page compare-page">
      <div className="breadcrumb"><span>Hooks</span><span>/</span><strong>Compare</strong></div>
      <header className="page-heading">
        <Badge>Comparison</Badge>
        <h1>Compare hooks</h1>
        <p>Explore two hooks side by side and compare their purpose, behavior, and implementation.</p>
      </header>

      <Card className="compare-controls">
        <CardContent>
          <label>First hook
            <select value={left.name} onChange={(event) => updateSide('left', event.target.value)}>
              {hookPages.map((page) => <option key={page.name} value={page.name}>{page.name}</option>)}
            </select>
          </label>
          <span className="versus">VS</span>
          <label>Second hook
            <select value={right.name} onChange={(event) => updateSide('right', event.target.value)}>
              {hookPages.map((page) => <option key={page.name} value={page.name}>{page.name}</option>)}
            </select>
          </label>
        </CardContent>
      </Card>

      <div className="comparison-grid">
        <ComparisonColumn key={`left-${left.name}`} page={left} />
        <ComparisonColumn key={`right-${right.name}`} page={right} />
      </div>
    </div>
  )
}

function HookPage() {
  const { hookName } = useParams()
  const navigate = useNavigate()
  const index = hookPages.findIndex(({ name }) => name === hookName)
  if (index === -1) return <Navigate to="/hooks/useState" replace />

  const page = hookPages[index]
  const Example = page.component
  const filename = `${page.name[0].toUpperCase()}${page.name.slice(1)}Example.jsx`
  const source = sourceFiles[`./hooks/${filename}`]
  const previous = hookPages[index - 1]
  const next = hookPages[index + 1]

  return (
    <div className="hook-page">
      <div className="breadcrumb"><span>Hooks</span><span>/</span><strong>{page.name}</strong></div>
      <header className="page-heading">
        <Badge>React API</Badge>
        <h1>{page.name}</h1>
        <p>{page.definition}</p>
      </header>

      <div className="page-grid">
        <Card>
          <CardHeader>
            <CardTitle>Interactive example</CardTitle>
            <CardDescription>Try the live use case below.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="example-stage"><Example /></CardContent>
        </Card>

        <aside className="details-column">
          <Card>
            <CardHeader>
              <CardTitle>When to use it</CardTitle>
              <CardDescription>{page.useCase}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Import</CardTitle>
            </CardHeader>
            <CardContent><code>import &#123; {page.name} &#125; from 'react'</code></CardContent>
          </Card>
        </aside>
      </div>

      <Card className="code-card">
        <CardHeader className="code-header">
          <div>
            <CardTitle>Source code</CardTitle>
            <CardDescription>src/hooks/{filename}</CardDescription>
          </div>
          <Badge>JSX</Badge>
        </CardHeader>
        <Separator />
        <div className="monaco-shell">
          <Editor
            key={filename}
            height="520px"
            language="javascript"
            path={filename}
            theme="vs-dark"
            value={source}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 22,
              padding: { top: 18, bottom: 18 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              automaticLayout: true,
              wordWrap: 'on',
            }}
          />
        </div>
      </Card>

      <footer className="page-navigation">
        {previous ? <Button variant="outline" onClick={() => navigate(`/hooks/${previous.name}`)}>← {previous.name}</Button> : <span />}
        {next && <Button onClick={() => navigate(`/hooks/${next.name}`)}>{next.name} →</Button>}
      </footer>
    </div>
  )
}

function App() {
  return (
    <div className="site-shell">
      <Sidebar />
      <HeaderNavigation />
      <main className="site-content">
        <Routes>
          <Route path="/hooks/:hookName" element={<HookPage />} />
          <Route path="/custom-hooks/:hookName" element={<CustomHookPage />} />
          <Route path="/code/:slug" element={<CodeQuestionPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/guides/state-management" element={<StateManagementGuide />} />
          <Route path="/guides/redux" element={<ReduxGuide />} />
          <Route path="/guides/tanstack-query" element={<TanStackQueryGuide />} />
          <Route path="/guides/javascript-qa" element={<JavaScriptQaGuide />} />
          <Route path="*" element={<Navigate to="/hooks/useState" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
