export const sender = 'terra1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu'
export const funds = []

export const formatResult = result => {
  const response = result.ok
    ? { timestamp: new Date(Date.now()), ...result.val }
    : { timestamp: new Date(Date.now()), error: result.val }
  return JSON.stringify(response, null, 2)
}
