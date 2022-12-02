<template>
  <h1>Welcome to the CosmWasm emulator!</h1>
  <p class="mb-4">
    The emulator allows you to run smart contracts written in CosmWasm in-browser,
    saving you from having to upload your contract to <a href="https://docs.terra.money/learn/terra-station/testnet/">Testnet</a> every time.
    The emulator uses the <a href="https://github.com/Terran-One/cw-simulate">cw-simulate</a> library.
  </p>

  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Upload your contract</h5>

      <div v-if="error" class="alert alert-danger mt-4" role="alert">
        File upload failed: {{error}}
      </div>

      <p class="card-text">
        Please upload your compiled wasm binary below to get started.
        This code doesn't get sent anywhere - everything is done in the browser.
      </p>

      <div class="mb-3">
        <input class="form-control mt-4" type="file" id="wasm-binary-file" v-on:change="saveWasm">
      </div>

      <div class="d-md-flex justify-content-md-end mt-4">
        <button class="btn btn-primary" v-on:click="instantiateOrNavigate" :class="{ disabled: !isValid }">Next: instantiate contract &rsaquo;&rsaquo;</button>
      </div>
    </div>
  </div>
</template>

<script>
  import state from '../state/state'
  import { CWSimulateApp } from '@terran-one/cw-simulate'
  import { defaultAppConfig } from '../utils/defaults'
  import { doInstantiate } from '../utils/instantiation'
  import { extractBytecode } from '../utils/wasm'

  export default {
    data () {
      return {
        isValid: false,
        error: ''
      }
    },
    methods: {
      async instantiateOrNavigate() {
        state.app = new CWSimulateApp(defaultAppConfig)

        const result = await doInstantiate(state.app, {})
        if (result.ok) {
          state.contractAddress = result.val.events[0].attributes[0].value
          this.$router.push('/emulator')
        } else {
          this.$router.push('/instantiate')
        }
      },
      saveWasm(e) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file);

        reader.onload = () => {
          const contents = reader.result;
          if (!contents) {
            state.wasmBytecode = []
            this.isValid = false
            this.error = 'File is empty'
            return;
          }

          try {
            state.wasmBytecode = Buffer.from(extractBytecode(contents));
            this.isValid = true
            this.error = ''
          } catch (e) {
            state.wasmBytecode = []
            this.isValid = false
            this.error = e.message ?? e
            return;
          }
        }

        reader.onerror = e => {
          state.wasmBytecode = []
          this.isValid = false
          this.error = e.message ?? e
        }
      }
    },
    mounted() {
      state.wasmBytecode = []
    }
  };
</script>
