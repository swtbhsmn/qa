export function Button({ className = '', variant = 'default', ...props }) {
  return <button className={`ui-button ${variant} ${className}`} {...props} />
}
