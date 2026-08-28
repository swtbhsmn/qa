export function Badge({ className = '', ...props }) {
  return <span className={`ui-badge ${className}`} {...props} />
}
