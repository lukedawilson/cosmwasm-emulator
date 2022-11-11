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

      <p class="card-text">
        Please upload your compiled wasm binary below to get started.
        This code doesn't get sent anywhere - everything is done in the browser.
      </p>

      <div class="mb-3">
        <input class="form-control mt-4" type="file" id="wasm-binary-file" v-on:change="saveWasm">
      </div>

      <div class="d-md-flex justify-content-md-end mt-4">
        <router-link to="/instantiate" class="btn btn-primary" :class="{ disabled: isInvalid() }">Next</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import state from '../state/state'

  export default {
    methods: {
      saveWasm(e) {
        state.wasmBinary = e.target.files[0]
        this.isValid = true
      },
      isInvalid () {
        return !state.wasmBinary.name?.toLocaleLowerCase().endsWith('.wasm')
      }
    },
    mounted() {
      state.wasmBinary = File
    }
  };
</script>
