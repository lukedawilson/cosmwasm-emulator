<template>
  <h1>Welcome to the CosmWasm emulator!</h1>
  <p class="lg"><em>Powered by <a href="https://github.com/Terran-One/cw-simulate" target="_">cw&#8209;simulate</a></em></p>
  <p class="mb-4">
    The CosmWasm emulator runs smart contracts <strong>in your browser</strong>, dramatically speeding up development and testing.
    Instead of having to upload your contract to a testnet, you can run it locally and see the results immediately.
    What's more, <strong>your code doesn't get sent anywhere</strong> - everything is done locally.
  </p>

  <div v-if="error" class="alert alert-danger mt-4" role="alert">
    File upload failed: {{error}}
  </div>

  <h5 class="bg-dark m-0 p-2">Upload contract</h5>
  <div class="border-dark p-2" style="border: 1px solid">
    <div>Please select your compiled wasm binary to get started.</div>
    <input class="form-control mt-3" type="file" id="wasm-binary-file" accept=".wasm" v-on:change="saveWasm">
  </div>

  <div class="d-md-flex justify-content-md-end mt-4">
    <button class="btn btn-primary" v-on:click="instantiateOrNavigate" :class="{ disabled: !isValid }">Next: instantiate contract &rsaquo;&rsaquo;</button>
  </div>
</template>

<script>
  import state from '../state/state'
  import { CWSimulateApp } from '@terran-one/cw-simulate'
  import { defaultAppConfig } from '@/utils/defaults'
  import { doInstantiate } from '@/utils/instantiation'
  import { extractBytecode } from '@/utils/wasm'

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
      state.instantiateMessage = null
      state.contractAddress = null
      state.wasmBytecode = []
    }
  };
</script>
