<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Instantiate your contract</h5>

      <p class="card-text">
        Please enter instantiate message JSON for the contract.
      </p>

      <JsonInput v-on:change="handleChange($event)" />

      <div v-if="isError">
        <label class="mt-4">Error response:</label>
        <textarea readonly class="form-control text-danger" rows="10" v-model="response"></textarea>
      </div>

      <div class="d-md-flex justify-content-md-end mt-4">
        <button class="btn btn-primary" v-on:click="instantiate" :class="{ disabled: !isValid }">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { CWSimulateApp } from '@terran-one/cw-simulate'
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import { sender, funds } from '../global'

  export default {
    components: {
      JsonInput
    },
    data() {
      return {
        isValid: false,
        isError: false,
        message: {},
        response: ''
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
        const wasmBytecode = state.wasmBytecode

        state.app = new CWSimulateApp({
          chainId: 'phoenix-1',
          bech32Prefix: 'terra'
        })

        const codeId = state.app.wasm.create(sender, wasmBytecode)
        const result = await state.app.wasm.instantiateContract(sender, funds, codeId, this.message)
        if (!result.ok) {
          this.isValid = false
          this.isError = true
          this.response = JSON.stringify(result, null, 2)
          return
        }

        state.contractAddress = result.val.events[0].attributes[0].value
        this.$router.push('/emulator')
      }
    }
  };
</script>
