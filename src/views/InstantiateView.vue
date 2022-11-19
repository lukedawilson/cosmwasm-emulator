<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Instantiate your contract</h5>

      <p class="card-text">
        Please enter instantiate message JSON for the contract.
      </p>

      <JsonInput v-on:change="handleChange($event)" :initialValue="initialValue" />

      <div v-if="isError">
        <label class="mt-4">Error response:</label>
        <textarea readonly class="form-control text-danger" rows="10" v-model="response"></textarea>
      </div>

      <div class="d-flex justify-content-between bd-highlight mt-4">
        <router-link to="/" class="btn btn-secondary">&lsaquo;&lsaquo; Back to wasm upload</router-link>
        <button class="btn btn-primary" v-on:click="instantiate" :class="{ disabled: !isValid }">Next: go to emulator &rsaquo;&rsaquo;</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { CWSimulateApp } from '@terran-one/cw-simulate'
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import { sender, funds, formatResult } from '../global'

  const defaultAppConfig = {
    chainId: 'phoenix-1',
    bech32Prefix: 'terra'
  }

  const missingFieldError = 'missing field'
  const invalidTypeError = 'Invalid type'
  const invalidWholeError = 'Error parsing whole'
  const invalidDigitError = 'invalid digit found in string'

  async function doInstantiate(app, message) {
    const codeId = app.wasm.create(sender, state.wasmBytecode)
    try {
      return await app.wasm.instantiateContract(sender, funds, codeId, message)
    } catch (e) {
      return { val: e.message }
    }
  }

  async function buildSchema() {
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

  function getMissingFieldName(result) {
    let idx = result.val.indexOf(missingFieldError)
    if (idx === -1) return null

    idx += missingFieldError.length
    return result.val.slice(idx).split('`').map(x => x?.trim()).filter(x => !!x)[0]
  }

  export default {
    components: {
      JsonInput
    },
    data() {
      return {
        isValid: false,
        isError: false,
        message: {},
        response: '',
        initialValue: ''
      }
    },
    methods: {
      handleChange(message) {
        this.isError = false

        try {
          this.message = JSON.parse(message)
          this.isValid = true
        } catch {
          this.isValid = false
        }
      },
      async instantiate() {
        state.app = new CWSimulateApp(defaultAppConfig)

        const result = await doInstantiate(state.app, this.message)
        if (!result.ok) {
          // if the error is 'missing field', add a placeholder for the missing field to the message
          let missingField = getMissingFieldName(result)
          if (missingField) {
            this.message[missingField] = `MY_${missingField.toLocaleUpperCase()}`
            this.initialValue = JSON.stringify(this.message, null, 2).replace(`"${this.message[missingField]}"`, this.message[missingField])
          }

          this.isValid = false
          this.isError = true
          this.response = formatResult(result)
          return
        }

        state.contractAddress = result.val.events[0].attributes[0].value
        this.$router.push('/emulator')
      }
    },
    async mounted() {
      state.app = new CWSimulateApp({
        chainId: 'phoenix-1',
        bech32Prefix: 'terra'
      })

      let result = await doInstantiate(state.app, {})
      if (result.ok) {
        state.contractAddress = result.val.events[0].attributes[0].value
        this.$router.push('/emulator')
        return
      }

      // build up schema from error messages
      const schema = await buildSchema()
      this.initialValue = JSON.stringify(schema, null, 2).replaceAll('"UNKNOWN_TYPE"', "UNKNOWN_TYPE")
      this.message = schema
      this.isValid = true
    }
  };
</script>
