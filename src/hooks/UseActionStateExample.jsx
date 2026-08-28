import { useActionState } from 'react'

const initialState = { message: '', name: '', success: false }

async function submitGreeting(_previousState, formData) {
  const name = formData.get('name')?.toString().trim() ?? ''

  await new Promise((resolve) => setTimeout(resolve, 700))

  if (!name) {
    return { message: 'Please enter your name.', name: '', success: false }
  }

  return {
    message: `Welcome, ${name}! Your form was submitted successfully.`,
    name,
    success: true,
  }
}

function UseActionStateExample() {
  const [state, formAction, isPending] = useActionState(
    submitGreeting,
    initialState,
  )

  return (
    <section className="action-state-card">
      <span className="eyebrow">React 19 hook</span>
      <h1>useActionState</h1>
      <p className="intro">
        Submit the form to see an action update its state and pending status.
      </p>

      <form action={formAction}>
        <label htmlFor="name">Your name</label>
        <div className="form-row">
          <input
            id="name"
            name="name"
            placeholder="Ada Lovelace"
            defaultValue={state.name}
            aria-describedby="form-message"
            disabled={isPending}
          />
          <button type="submit" disabled={isPending}>
            {isPending ? 'Submitting…' : 'Say hello'}
          </button>
        </div>
      </form>

      {state.message && (
        <p
          id="form-message"
          className={`form-message ${state.success ? 'success' : 'error'}`}
          role="status"
        >
          {state.message}
        </p>
      )}

      <div className="hook-signature">
        <code>[state, formAction, isPending] = useActionState(action, initialState)</code>
      </div>
    </section>
  )
}

export default UseActionStateExample
