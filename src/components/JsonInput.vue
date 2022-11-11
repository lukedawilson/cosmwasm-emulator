<template>
  <codemirror
    v-model="code"
    :placeholder="placeholder"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="log('change', $event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
</template>

<script>
  import { defineComponent } from 'vue'
  import { Codemirror } from 'vue-codemirror'
  import { json } from '@codemirror/lang-json'
  import { oneDark } from '@codemirror/theme-one-dark'

  export default defineComponent({
    components: {
      Codemirror
    },
    setup() {
      const placeholder = `{ "count": 0 }`
      const extensions = [json(), oneDark]

      return {
        placeholder,
        extensions,
        log: console.log
      }
    }
  })
</script>
