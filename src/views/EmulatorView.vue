<template>
  <div class="row">
    <div class="col">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Execute</h5>

          <label>Message JSON:</label>
          <JsonInput v-on:change="handleChange(this.execute, $event)" />

          <div class="d-md-flex text-center mt-4">
            <button class="btn btn-primary" v-on:click="doExecute" :class="{ disabled: !execute.isValid }">Execute</button>
          </div>

          <label class="mt-4">Response:</label>
          <textarea readonly class="form-control" rows="6" v-model="execute.response" :class="{ 'text-danger': !execute.isSuccess, 'text-success': execute.isSuccess }"></textarea>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Query</h5>

          <label>Message JSON:</label>
          <JsonInput v-on:change="handleChange(this.query, $event)" />

          <div class="d-md-flex text-center mt-4">
            <button class="btn btn-primary" v-on:click="doQuery" :class="{ disabled: !query.isValid }">Query</button>
          </div>

          <label class="mt-4">Response:</label>
          <textarea readonly class="form-control" rows="6" v-model="query.response" :class="{ 'text-danger': !query.isSuccess, 'text-success': query.isSuccess }"></textarea>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">State</h5>
          <textarea readonly class="form-control text-info" rows="6" v-model="simulationState"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import { formatResult } from '../utils/messages'
  import { sender, funds } from '../utils/defaults'

  function formattedState() {
    const wasm = state.app.store.get('wasm')
    if (!wasm || !wasm.get) {
      console.warn(`Failed to retrieve state. Expected the cw-simulate app object store to contain a 'wasm' entry of type Map. The app object is`, state.app)
      return 'Error retrieving state - see browser dev console for details'
    }

    const contractAddrToContractProps = new Map(wasm.get('contractStorage'))
    const contractProps = new Map(contractAddrToContractProps.get(state.contractAddress))

    const stateB64 = contractProps.get(btoa('state'))
    if (!stateB64) {
      return '{}'
    }

    const decodedStr = atob(stateB64)
    const simulationState = JSON.parse(decodedStr)
    return JSON.stringify(simulationState, null, 2)
  }

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
        },
        simulationState: {}
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
        this.execute.response = formatResult(result)
        this.execute.isSuccess = result.ok
        this.simulationState = formattedState()
      },
      async doQuery() {
        const result = await state.app.wasm.query(state.contractAddress, this.query.message)
        this.query.response = formatResult(result)
        this.query.isSuccess = result.ok
      }
    },
    mounted() {
      this.simulationState = formattedState()
    }
  };
</script>
