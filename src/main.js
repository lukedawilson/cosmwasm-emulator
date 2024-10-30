import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './scss/styles.scss'

import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/atom-one-dark.css' // higlight.js theme
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript)

const app = createApp(App)

app.use(router)
app.directive('highlight', {
  mounted(el) {
    el.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  }
})

app.mount('#app')
