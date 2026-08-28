import { useEffect, useState } from 'react'

function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        return response.json()
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, error: error.message, loading: false })
        }
      })

    return () => controller.abort()
  }, [url])

  return state
}

function UseFetchExample() {
  const { data, error, loading } = useFetch('/sample-user.json')

  return (
    <section>
      <h2>useFetch: Reusable request state</h2>
      {loading && <p>Loading user…</p>}
      {error && <p role="alert">{error}</p>}
      {data && (
        <div>
          <strong>{data.name}</strong>
          <p>{data.role} · {data.location}</p>
        </div>
      )}
    </section>
  )
}

export default UseFetchExample
