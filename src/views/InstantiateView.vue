<template>
  <div class="form-group row">
    <div class="col-sm-2 d-flex align-items-center fw-bold">Your address</div>
    <div class="col-sm-10 d-flex align-items-center">
      <input type="text" :value="yourAddress()" class="form-control-plaintext text-primary" readonly />
    </div>
  </div>
  <div class="form-group row mt-1">
    <div class="col-sm-2 d-flex align-items-center fw-bold">Chain config</div>
    <div class="col-sm-10 mt-2 d-flex align-items-center">{{ chainConfig() }}</div>
  </div>

  <h5 class="bg-dark border-dark m-0 p-2 mt-4">Instantiation message</h5>

  <JsonInput v-on:change="handleChange($event)" :initialValue="initialValue" />

  <div v-if="isError">
    <h5 class="bg-dark border-dark mt-4 mb-0 p-2">Error response</h5>
    <textarea readonly
              :rows="this.response?.split('\n').length || 1" wrap="off"
              class="form-control rounded-0 border-dark text-danger overflow-auto"
              v-model="response"></textarea>
  </div>

  <div class="d-flex justify-content-between bd-highlight mt-4">
    <button class="btn btn-secondary me-1" v-on:click="home">&lsaquo;&lsaquo; Back to wasm upload</button>
    <button class="btn btn-primary ms-1" v-on:click="instantiate" :class="{ disabled: !isValid }">Next: go to emulator &rsaquo;&rsaquo;</button>
  </div>

  <div class="mt-4">
    <h5 class="bg-dark border-dark m-0 p-2">Generate Terra address</h5>
    <div class="border-dark p-2" style="border: 1px solid">
      <div>
        You can generate a random, valid Terra address by clicking the button below.
        The emulator is entirely offline and does not interact with the Terra network.
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-outline-primary mt-3" v-on:click="generateRandomAddress">Generate</button>
        <input v-if="randomAddress" type="text" :value="randomAddress" class="form-control-plaintext text-success mt-3 ms-3" readonly />
      </div>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import { doInstantiate, inferInstantiationMessageSchema, getMissingFieldName } from '@/utils/instantiation'
  import { formatResult } from '@/utils/messages'
  import { defaultAppConfig, sender } from '@/utils/defaults'
  import generateTerraAddress from '@/utils/generate-terra-address';

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
        initialValue: '',
        randomAddress: ''
      }
    },
    methods: {
      generateRandomAddress() {
        this.randomAddress = generateTerraAddress()
      },
      yourAddress() {
        return sender
      },
      chainConfig() {
        return JSON.stringify(defaultAppConfig)
      },
      handleChange(message) {
        this.isError = false

        try {
          this.message = JSON.parse(message)
          this.isValid = true
        } catch {
          this.isValid = false
        }
      },
      home() {
        this.$router.push('/')
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
          this.response = formatResult(result, 2)
          return
        }

        state.instantiateMessage = this.message
        state.contractAddress = result.val.events[0].attributes[0].value
        this.$router.push('/emulator')
      }
    },
    async mounted() {
      const _this = this
      const init = async () => {
        if (state.instantiateMessage) {
          _this.initialValue = JSON.stringify(state.instantiateMessage, null, 2)
          _this.message = state.instantiateMessage
        } else {
          const initialValue = await inferInstantiationMessageSchema()
          _this.initialValue = JSON.stringify(initialValue, null, 2).replaceAll('"UNKNOWN_TYPE"', "UNKNOWN_TYPE")
          _this.message = initialValue
        }

        this.isValid = true
      }

      window.addEventListener('popstate', async e => {
        if (e.state.current !== '/instantiate') {
          return
        }

        await init()
      });

      await init()
    }
  };
</script>
