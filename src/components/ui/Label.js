const Label = ({ children, className = "", ...props }) => {
  return (
    <label className={`text-sm font-semibold text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  )
}

export default Label
