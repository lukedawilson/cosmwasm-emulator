<template>
  <codemirror
    v-model="value"
    :placeholder="placeholder"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @change="handleChange($event)"
  />
</template>

<script>
  import { defineComponent, ref } from 'vue'
  import { Codemirror } from 'vue-codemirror'
  import { json } from '@codemirror/lang-json'
  import { oneDark } from '@codemirror/theme-one-dark'

  export default defineComponent({
    components: {
      Codemirror
    },
    props: ['initialValue'],
    data() {
      return {
        value: ref(''),
        valueInitHistory: []
      }
    },
    setup() {
      return {
        extensions: [json(), oneDark],
        placeholder: '{ "enter some": "valid json" }'
      }
    },
    methods: {
      handleChange(value) {
        try {
          this.$emit('change', value)
        } catch {}
      }
    },
    updated() {
      if (this.initialValue && JSON.stringify(this.initialValue) !== JSON.stringify(this.valueInitHistory[this.valueInitHistory.length - 1])) {
        this.value = ref(this.initialValue)
        this.valueInitHistory.push(this.initialValue)
      }
    }
  })
</script>
