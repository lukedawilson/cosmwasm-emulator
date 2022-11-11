<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Instantiate your contract</h5>

      <p class="card-text">
        Please enter instantiate message JSON for the contract.
      </p>

      <JsonInput />

      <div class="d-md-flex justify-content-md-end mt-4">
        <router-link to="/instantiate" class="btn btn-primary">Next</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'

  export default {
    components: {
      JsonInput
    },
    data() {
      return {
        instantiateResponse: ''
      }
    },
    mounted() {
      console.log(state.wasmBinary)
    }
  };
</script>
