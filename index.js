const {Transaction, PrivateKey} = require('@dashevo/dashcore-lib')
const { getAddressUtxos, broadcastTransaction } = require('./utils')
const process = require('process')

if (!process.env.ADDRESS) {
  throw new Error("ADDRESS env must be set")
}

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY env must be set")
}

if (!process.env.RPC_HOST) {
  throw new Error("RPC_HOST env must be set")
}

if (!process.env.RPC_PORT) {
  throw new Error("RPC_PORT env must be set")
}

if (!process.env.RPC_USER) {
  throw new Error("RPC_USER env must be set")
}

if (!process.env.RPC_PASSWORD) {
  throw new Error("RPC_PASSWORD env must be set")
}

const main = async () => {
  const privateKey = PrivateKey.fromString(process.env.PRIVATE_KEY)
  const utxos = await getAddressUtxos(process.env.ADDRESS)
  const amount = utxos.reduce((acc, utxo) => utxo.satoshis + acc, 0)

  const transaction = new Transaction();

  transaction.from(utxos)
  transaction.to(process.env.ADDRESS, amount)
  transaction.sign(privateKey)

  const txid = await broadcastTransaction(transaction.toString())

  console.log('Successfully broadcasted transaction ' + txid)

  if (process.env.CRON_SECONDS) {
    setTimeout(main, Number(process.env.CRON_SECONDS) * 1000 );
  }
}

main().catch(console.error)
