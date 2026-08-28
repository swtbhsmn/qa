export function Card({ className = '', ...props }) {
  return <section className={`ui-card ${className}`} {...props} />
}

export function CardHeader({ className = '', ...props }) {
  return <header className={`ui-card-header ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }) {
  return <h2 className={`ui-card-title ${className}`} {...props} />
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`ui-card-description ${className}`} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={`ui-card-content ${className}`} {...props} />
}
