export const formatResult = (result, indentBy = null) => {
  const response = result.ok
    ? { timestamp: new Date(Date.now()), ...result.val }
    : { timestamp: new Date(Date.now()), error: result.val }
  return indentBy === null ? JSON.stringify(response) : JSON.stringify(response, null, 2)
}
