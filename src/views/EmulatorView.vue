<template>
  <div class="row">
    <div class="col">
      <div class="form-group row">
        <div class="col-sm-2 d-flex align-items-center fw-bold">Your address</div>
        <div class="col-sm-10 d-flex align-items-center">{{ yourAddress() }}</div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col mt-1">
      <div class="form-group row">
        <div class="col-sm-2 d-flex align-items-center fw-bold">Contract address</div>
        <div class="col-sm-10 d-flex align-items-center">{{ contractAddress() }}</div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col mt-4">
      <h5 class="bg-dark m-0 p-2">Message</h5>

      <JsonInput v-on:change="handleChange(this, $event)" style="min-height: 15em" />

      <div class="d-flex bg-dark p-2">
        <div class="d-flex align-items-center">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="query" name="query" value="query" v-model="messageType">
            <label class="form-check-label" for="query">
              Query
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="execute" name="execute" value="execute" v-model="messageType">
            <label class="form-check-label" for="execute">
              Execute
            </label>
          </div>
        </div>

        <div class="d-md-flex text-center">
          <button title="Run" class="btn btn-primary d-flex align-items-center bg-body border-primary text-primary ps-2 pe-2" v-on:click="run" :class="{ disabled: !isValid }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-6 mt-4">
      <h5 class="bg-dark border-dark m-0 p-2">Response</h5>
      <div class="border-dark" v-highlight>
        <pre class="m-0"><code class="language-javascript" style="height: 10em">{{ response }}</code></pre>
      </div>
    </div>
    <div class="col-6 mt-4">
      <h5 class="bg-dark border-dark m-0 p-2">State</h5>
      <div class="border-dark" v-highlight>
        <pre class="m-0"><code class="language-javascript" style="height: 10em">{{ simulationState }}</code></pre>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col mt-4">
      <h5 class="bg-dark border-dark m-0 p-2">Log</h5>
      <textarea wrap="off" readonly class="form-control rounded-0 border-dark text-secondary overflow-scroll" rows="6" v-model="log"></textarea>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import {formatResult} from '@/utils/messages'
  import {funds, sender} from '@/utils/defaults'

  function formattedState() {
    const wasm = state.app.store.get('wasm')
    if (!wasm || !wasm.get) {
      console.warn(`Failed to retrieve state. Expected the cw-simulate app object store to contain a 'wasm' entry of type Map. The app object is`, state.app)
      return 'Error retrieving state - see browser dev console for details'
    }

    const simulationState = {}

    const contractAddrToContractProps = new Map(wasm.get('contractStorage'))
    const contractProps = new Map(contractAddrToContractProps.get(state.contractAddress))

    let i = 0
    for (const key of contractProps.keys().toArray()) {
      if (key === btoa('config')) {
        continue
      }

      const binaryData = Buffer.from(key, 'base64')
      const decodedString = binaryData.toString('ascii')
      const balanceIndex = decodedString.indexOf("balance")
      if (balanceIndex === -1) {
        continue
      }

      simulationState[`balance_${i++}`] = atob(contractProps.get(key)).replace('"', '').replace('"', '')
    }

    return JSON.stringify(simulationState, null, 2)
  }

  export default {
    components: {
      JsonInput
    },
    data() {
      return {
        log: '',
        messageType: 'query',
        isValid: false,
        isSuccess: true,
        message: {},
        response: '',
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
      async run() {
        const result = this.messageType === 'query'
          ? await state.app.wasm.query(state.contractAddress, this.message)
          : await state.app.wasm.executeContract(sender, funds, state.contractAddress, this.message)

        this.response = formatResult(result, 2)
        this.isSuccess = result.ok
        this.simulationState = formattedState()

        this.log = `${new Date().toISOString()}:\n\tRequest: ${JSON.stringify(this.message)}\n\tResponse: ${formatResult(result)}\n${this.log}`
      },
      yourAddress() {
        return sender
      },
      contractAddress() {
        return state.contractAddress
      }
    },
    mounted() {
      this.simulationState = formattedState()
    }
  };
</script>
