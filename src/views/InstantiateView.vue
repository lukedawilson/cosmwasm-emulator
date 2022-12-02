<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Instantiate your contract</h5>

      <p class="card-text">
        Please enter instantiate message JSON for the contract.
      </p>

      <JsonInput v-on:change="handleChange($event)" :initialValue="initialValue" />

      <div v-if="isError">
        <label class="mt-4">Error response:</label>
        <textarea readonly class="form-control text-danger" rows="10" v-model="response"></textarea>
      </div>

      <div class="d-flex justify-content-between bd-highlight mt-4">
        <router-link to="/" class="btn btn-secondary">&lsaquo;&lsaquo; Back to wasm upload</router-link>
        <button class="btn btn-primary" v-on:click="instantiate" :class="{ disabled: !isValid }">Next: go to emulator &rsaquo;&rsaquo;</button>
      </div>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import { doInstantiate, buildSchema, getMissingFieldName, formatResult } from '../global'

  export default {
    components: {
      JsonInput
    },
    data() {
      return {
        isValid: false,
        isError: false,
        message: {},
        response: '',
        initialValue: ''
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
        const result = await doInstantiate(state.app, this.message)
        if (!result.ok) {
          // if the error is 'missing field', add a placeholder for the missing field to the message
          let missingField = getMissingFieldName(result)
          if (missingField) {
            this.message[missingField] = `MY_${missingField.toLocaleUpperCase()}`
            this.initialValue = JSON.stringify(this.message, null, 2).replace(`"${this.message[missingField]}"`, this.message[missingField])
          }

          this.isValid = false
          this.isError = true
          this.response = formatResult(result)
          return
        }

        state.contractAddress = result.val.events[0].attributes[0].value
        this.$router.push('/emulator')
      }
    },
    async mounted() {
      // build up schema from error messages
      const schema = await buildSchema()
      this.initialValue = JSON.stringify(schema, null, 2).replaceAll('"UNKNOWN_TYPE"', "UNKNOWN_TYPE")
      this.message = schema
      this.isValid = true
    }
  };
</script>
