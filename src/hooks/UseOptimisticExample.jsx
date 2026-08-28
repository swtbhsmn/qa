import { useOptimistic, useState } from 'react'

function UseOptimisticExample() {
  const [messages, setMessages] = useState(['Welcome!'])
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (current, message) => [...current, `${message} (sending…)`],
  )

  async function sendMessage(formData) {
    const message = formData.get('message')?.toString().trim()
    if (!message) return
    addOptimisticMessage(message)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setMessages((current) => [...current, message])
  }

  return (
    <section>
      <h2>useOptimistic: Instant message feedback</h2>
      <ul>{optimisticMessages.map((message, index) => <li key={`${message}-${index}`}>{message}</li>)}</ul>
      <form action={sendMessage}>
        <input name="message" placeholder="New message" />
        <button>Send</button>
      </form>
    </section>
  )
}

export default UseOptimisticExample
