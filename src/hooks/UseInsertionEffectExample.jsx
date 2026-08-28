import { useInsertionEffect } from 'react'

function UseInsertionEffectExample() {
  useInsertionEffect(() => {
    const style = document.createElement('style')
    style.textContent = '.insertion-demo { color: #0f766e; font-weight: 700; }'
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  return (
    <section>
      <h2>useInsertionEffect: CSS-in-JS style insertion</h2>
      <p className="insertion-demo">This style is inserted before layout effects run.</p>
    </section>
  )
}

export default UseInsertionEffectExample
