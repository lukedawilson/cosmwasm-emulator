<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Instantiate your contract</h5>

      <p class="card-text">
        Please enter instantiate message JSON for the contract.
      </p>

      <JsonInput v-on:change="handleChange($event)" />

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

  export default {
    components: {
      JsonInput
    },
    data() {
      return {
        isValid: false,
        message: {},
        response: ''
      }
    },
    methods: {
      handleChange(message) {
        try {
          this.message = JSON.parse(message)
          this.isValid = true
        } catch {
          this.isValid = false
        }
      },
      async instantiate() {
        const sender = 'terra1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu'
        const funds = []
        const wasmBytecode = state.wasmBytecode

        state.app = new CWSimulateApp({
          chainId: 'phoenix-1',
          bech32Prefix: 'terra'
        })

        const codeId = state.app.wasm.create(sender, wasmBytecode)
        const result = await state.app.wasm.instantiateContract(sender, funds, codeId, this.message)
        if (!result.ok) {
          this.isValid = false
          return
        }

        state.contractAddress = result.val.events[0].attributes[0].value
        this.$router.push('/execute-query')
      }
    }
  };
</script>
