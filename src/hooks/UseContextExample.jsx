import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext('light')

function ThemePreview() {
  const theme = useContext(ThemeContext)
  return <p>Current theme from context: {theme}</p>
}

function UseContextExample() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <section>
        <h2>useContext: Shared theme</h2>
        <ThemePreview />
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle theme
        </button>
      </section>
    </ThemeContext.Provider>
  )
}

export default UseContextExample
