<template>
  <h5 class="bg-dark border-dark m-0 p-2">Instantiation message</h5>

  <JsonInput v-on:change="handleChange($event)" :initialValue="initialValue" />

  <div v-if="isError">
    <label class="mt-4">Error response:</label>
    <textarea readonly class="form-control text-danger" rows="10" v-model="response"></textarea>
  </div>

  <div class="d-flex justify-content-between bd-highlight mt-4">
    <button class="btn btn-secondary" v-on:click="home">&lsaquo;&lsaquo; Back to wasm upload</button>
    <button class="btn btn-primary" v-on:click="instantiate" :class="{ disabled: !isValid }">Next: go to emulator &rsaquo;&rsaquo;</button>
  </div>

  <div class="mt-4">
    <h5 class="bg-dark border-dark m-0 p-2">Terra address</h5>
    <div class="border-dark" v-highlight>
    <pre class="m-0"><code class="language-python">"""
You can generate a valid random Terra address with this Python code.
Remember to install the bech32 library with `pip install bech32`.
"""

import os
from bech32 import bech32_encode, convertbits # remember to install bech32 with `pip install bech32`

def generate_terra_address():
    data = os.urandom(20)
    words = convertbits(data, 8, 5)
    return bech32_encode("terra", words)

print(generate_terra_address())</code></pre>
    </div>
  </div>
</template>

<script>
  import JsonInput from '../components/JsonInput.vue'
  import state from '../state/state'
  import { doInstantiate, inferInstantiationMessageSchema, getMissingFieldName } from '@/utils/instantiation'
  import { formatResult } from '@/utils/messages'

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
          this.response = formatResult(result)
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
