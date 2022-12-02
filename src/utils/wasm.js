export const extractBytecode = (contents) => {
  if (typeof contents !== 'string')
    return contents

  const prefix = 'data:application/wasm;base64,'
  if (!contents.startsWith(prefix))
    throw new Error(`Malformed WASM source file`)

  const base64 = contents.substring(prefix.length)
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer;
}
