<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Execute</h5>

            <label>Message JSON:</label>
            <JsonInput v-on:change="handleChange(this.execute, $event)" />

            <div class="d-md-flex text-center mt-4">
              <button class="btn btn-primary" v-on:click="doExecute" :class="{ disabled: !execute.isValid }">Execute</button>
            </div>

            <label class="mt-4">Response:</label>
            <textarea readonly class="form-control" rows="10" v-model="execute.response" :class="{ 'text-danger': !execute.isSuccess, 'text-success': execute.isSuccess }"></textarea>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Query</h5>

            <label>Message JSON:</label>
            <JsonInput v-on:change="handleChange(this.query, $event)" />

            <div class="d-md-flex text-center mt-4">
              <button class="btn btn-primary" v-on:click="doQuery" :class="{ disabled: !query.isValid }">Query</button>
            </div>

            <label class="mt-4">Response:</label>
            <textarea readonly class="form-control" rows="10" v-model="query.response" :class="{ 'text-danger': !query.isSuccess, 'text-success': query.isSuccess }"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import { sender, funds } from '../global'

  export default {
    components: {
      JsonInput
    },
    data() {
      return {
        execute: {
          isValid: false,
          isSuccess: true,
          message: {},
          response: ''
        },
        query: {
          isValid: false,
          isSuccess: true,
          message: {},
          response: ''
        }
      }
    },
    methods: {
      handleChange(config, message) {
        try {
          config.message = JSON.parse(message)
          config.isValid = true
        } catch {
          config.isValid = false
        }
      },
      async doExecute() {
        const result = await state.app.wasm.executeContract(sender, funds, state.contractAddress, this.execute.message)
        this.execute.response = JSON.stringify(result, null, 2)
        this.execute.isSuccess = result.ok
      },
      async doQuery() {
        const result = await state.app.wasm.query(state.contractAddress, this.query.message)
        this.query.response = JSON.stringify(result, null, 2)
        this.query.isSuccess = result.ok
      }
    }
  };
</script>
