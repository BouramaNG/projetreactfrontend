export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "FRANC CFA",
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`
}

export const calculateTransformationRate = (sales, meetings) => {
  if (!meetings || meetings === 0) return 0
  return Math.round((sales / meetings) * 100)
}
