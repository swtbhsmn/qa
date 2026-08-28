import { useId } from 'react'

function UseIdExample() {
  const emailId = useId()
  const hintId = useId()

  return (
    <section>
      <h2>useId: Accessible form fields</h2>
      <label htmlFor={emailId}>Email address</label>
      <input id={emailId} aria-describedby={hintId} type="email" />
      <p id={hintId}>We will never share your email.</p>
    </section>
  )
}

export default UseIdExample
