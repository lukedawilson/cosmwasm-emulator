import state from '../state/state'
import { CWSimulateApp } from '@terran-one/cw-simulate'
import { defaultAppConfig, sender, funds } from './defaults'

const missingFieldError = 'missing field'
const invalidTypeError = 'Invalid type'
const invalidWholeError = 'Error parsing whole'
const invalidDigitError = 'invalid digit found in string'

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
