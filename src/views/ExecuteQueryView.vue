<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Execute and query</h5>

      <label>Message JSON:</label>
      <JsonInput v-on:change="handleChange($event)" />

      <div class="d-md-flex text-center mt-4">
        <button class="btn btn-primary" v-on:click="execute" :class="{ disabled: !isValid }">Execute</button>
        &nbsp;
        <button class="btn btn-primary" v-on:click="query" :class="{ disabled: !isValid }">Query</button>
      </div>

      <label class="mt-4">Response:</label>
      <textarea readonly class="form-control" rows="10" v-model="response"></textarea>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'

  const sender = 'terra1hgm0p7khfk85zpz5v0j8wnej3a90w709vhkdfu'
  const funds = []

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
      async execute() {
        const result = await state.app.wasm.executeContract(sender, funds, state.contractAddress, this.message)
        this.response = JSON.stringify(result, null, 2)
      },
      async query() {
        const result = await state.app.wasm.query(state.contractAddress, this.message)
        this.response = JSON.stringify(result, null, 2)
      }
    }
  };
</script>
