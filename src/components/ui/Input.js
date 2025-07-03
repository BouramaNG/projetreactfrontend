const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`h-12 w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export default Input
