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

  async function doInstantiate(message) {
    const codeId = state.app.wasm.create(sender, state.wasmBytecode)
    try {
      return await state.app.wasm.instantiateContract(sender, funds, codeId, message)
    } catch (e) {
      return { val: e.message }
    }
  }

  const errorMessageSearchString = 'missing field'

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
        state.app = new CWSimulateApp({
          chainId: 'phoenix-1',
          bech32Prefix: 'terra'
        })

        const result = await doInstantiate(this.message)
        if (!result.ok) {
          // if the error is 'missing field', add a placeholder for the missing field to the message
          let idx = result.val.indexOf(errorMessageSearchString)
          if (idx !== -1) {
            idx += errorMessageSearchString.length
            const field = result.val.slice(idx).split('`').map(x => x?.trim()).filter(x => !!x)[0]
            this.message[field] = `MY_${field.toLocaleUpperCase()}`
            this.initialValue = JSON.stringify(this.message, null, 2).replace(`"${this.message[field]}"`, this.message[field])
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

      const result = await doInstantiate(this.message)
      if (result.ok) {
        state.contractAddress = result.val.events[0].attributes[0].value
        this.$router.push('/emulator')
        return
      }

      // build up partial schema from error message
      const idx = result.val.indexOf(errorMessageSearchString) + errorMessageSearchString.length
      const field = result.val.slice(idx).split('`').map(x => x?.trim()).filter(x => !!x)[0]

      const schema = {}
      schema[field] = `MY_${field.toLocaleUpperCase()}`

      this.initialValue = JSON.stringify(schema, null, 2).replace(`"${schema[field]}"`, schema[field])
    }
  };
</script>
