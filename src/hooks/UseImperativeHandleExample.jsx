import { forwardRef, useImperativeHandle, useRef } from 'react'

const CustomInput = forwardRef(function CustomInput(_props, ref) {
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = ''
    },
  }), [])

  return <input ref={inputRef} placeholder="Imperative input" />
})

function UseImperativeHandleExample() {
  const inputHandle = useRef(null)

  return (
    <section>
      <h2>useImperativeHandle: Custom ref API</h2>
      <CustomInput ref={inputHandle} />
      <button onClick={() => inputHandle.current?.focus()}>Focus</button>
      <button onClick={() => inputHandle.current?.clear()}>Clear</button>
    </section>
  )
}

export default UseImperativeHandleExample
