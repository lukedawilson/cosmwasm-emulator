import { reactive } from 'vue'
import { CWSimulateApp } from '@terran-one/cw-simulate'

export default reactive({
  wasmBytecode: [],
  app: CWSimulateApp,
  contractAddress: ''
})
