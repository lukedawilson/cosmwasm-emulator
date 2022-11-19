import state from './state/state'
import { CWSimulateApp } from '@terran-one/cw-simulate'

export const defaultAppConfig = {
  chainId: 'phoenix-1',
  bech32Prefix: 'terra'
}

export const sender = 'terra1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu'
export const funds = []

const missingFieldError = 'missing field'
const invalidTypeError = 'Invalid type'
const invalidWholeError = 'Error parsing whole'
const invalidDigitError = 'invalid digit found in string'

export const formatResult = result => {
  const response = result.ok
    ? { timestamp: new Date(Date.now()), ...result.val }
    : { timestamp: new Date(Date.now()), error: result.val }
  return JSON.stringify(response, null, 2)
}

export const doInstantiate = async (app, message) => {
  const codeId = app.wasm.create(sender, state.wasmBytecode)
  try {
    return await app.wasm.instantiateContract(sender, funds, codeId, message)
  } catch (e) {
    return { val: e.message }
  }
}

export const buildSchema = async() => {
  const schema = {}
  const typeVals = ["STRING", 0.0, 0, "0.0", "0"]
  let typeIdx = 0, field

  const dummyApp = new CWSimulateApp(defaultAppConfig)

  while (true) {
    const result = await doInstantiate(dummyApp, schema)
    if (result.ok) {
      return schema
    }

    let idx
    if ((idx = result.val.indexOf(missingFieldError)) !== -1) {
      typeIdx = 0

      idx += missingFieldError.length
      field = result.val.slice(idx).split('`').map(x => x?.trim()).filter(x => !!x)[0]

      schema[field] = typeVals[typeIdx]
    } else if (result.val.indexOf(invalidTypeError) !== -1 || result.val.indexOf(invalidWholeError) !== -1 || result.val.indexOf(invalidDigitError) !== -1) {
      if (typeIdx === typeVals.length - 1) {
        schema[field] = "UNKNOWN_TYPE"
        return schema
      }

      typeIdx ++
      schema[field] = typeVals[typeIdx]
    } else {
      return schema
    }
  }
}

export const getMissingFieldName = (result) => {
  let idx = result.val.indexOf(missingFieldError)
  if (idx === -1) return null

  idx += missingFieldError.length
  return result.val.slice(idx).split('`').map(x => x?.trim()).filter(x => !!x)[0]
}

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
