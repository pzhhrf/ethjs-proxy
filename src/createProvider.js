const RpcEngine = require('json-rpc-engine')
const providerFromEngine = require('eth-json-rpc-middleware/providerFromEngine')
const createInfuraMiddleware = require('./index')
const createEthFilterMiddleware = require('eth-json-rpc-filters')
const providerFromMiddleware = require('eth-json-rpc-middleware/providerFromMiddleware')
const BlockTracker = require('eth-block-tracker')
const HttpProvider = require('ethjs-provider-http')

module.exports = createProvider

function createProvider(opts){
  const engine = new RpcEngine()
  const infuraMiddleware = createInfuraMiddleware(opts)
  const provider = new HttpProvider('https://mainnet.infura.io')
  const blockTracker = new BlockTracker({ provider })
  const filterMiddleware = createEthFilterMiddleware({ blockTracker, provider })
  engine.push(filterMiddleware)
  engine.push(infuraMiddleware)
  return providerFromEngine(engine)
}
