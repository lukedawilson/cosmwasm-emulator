<template>
  <codemirror
    :placeholder="'{ ... }'"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @change="handleChange($event)"
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
      return { extensions: [json(), oneDark] }
    },
    methods: {
      handleChange(value) {
        try {
          this.$emit('change', value)
        } catch {}
      }
    }
  })
</script>
