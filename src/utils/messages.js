export const formatResult = result => {
  const response = result.ok
    ? { timestamp: new Date(Date.now()), ...result.val }
    : { timestamp: new Date(Date.now()), error: result.val }
  return JSON.stringify(response, null, 2)
}
