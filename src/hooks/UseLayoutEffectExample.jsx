import { useLayoutEffect, useRef, useState } from 'react'

function UseLayoutEffectExample() {
  const [isVisible, setIsVisible] = useState(false)
  const [placement, setPlacement] = useState('above')
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const targetRef = useRef(null)
  const tooltipRef = useRef(null)

  useLayoutEffect(() => {
    if (!isVisible || !targetRef.current || !tooltipRef.current) return

    const targetBox = targetRef.current.getBoundingClientRect()
    const measuredHeight = tooltipRef.current.getBoundingClientRect().height

    setTooltipHeight(measuredHeight)
    setPlacement(targetBox.top > measuredHeight + 16 ? 'above' : 'below')
  }, [isVisible])

  return (
    <section className="layout-effect-card">
      <span className="eyebrow">React hook</span>
      <h1>useLayoutEffect</h1>
      <p className="intro">
        The tooltip is measured and positioned before the browser paints, avoiding
        a visible jump from its initial position.
      </p>

      <div className="tooltip-stage">
        <div className="tooltip-target-wrap">
          <button
            ref={targetRef}
            type="button"
            className="tooltip-trigger"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-expanded={isVisible}
          >
            {isVisible ? 'Hide tooltip' : 'Show tooltip'}
          </button>

          {isVisible && (
            <div
              ref={tooltipRef}
              className={`measured-tooltip ${placement}`}
              role="tooltip"
            >
              Measured before paint
              <small>Height: {Math.round(tooltipHeight)}px</small>
            </div>
          )}
        </div>
      </div>

      <div className="measurement-note">
        <span aria-hidden="true">↕</span>
        <p>
          <strong>Why layout effect?</strong>
          DOM measurements are available after layout but before the screen updates.
        </p>
      </div>

      <div className="hook-signature">
        <code>useLayoutEffect(() =&gt; measureTooltip(), [isVisible])</code>
      </div>
    </section>
  )
}

export default UseLayoutEffectExample
