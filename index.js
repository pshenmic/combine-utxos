const {Transaction, PrivateKey} = require('@dashevo/dashcore-lib')
const { getAddressUtxos, broadcastTransaction, getBlockCount } = require('./utils')
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

const utxosLimit = process.env.UTXOS_SLICE ? Number(process.env.UTXOS_SLICE) : 500

const main = async () => {
  const blockCount = await getBlockCount()
  const privateKey = PrivateKey.fromString(process.env.PRIVATE_KEY)
  const utxos = (await getAddressUtxos(process.env.ADDRESS))
    .slice(0, utxosLimit)
    .filter((utxo => utxo.height < blockCount - 101))

  if (!utxos.length) {
    console.log(`Empty utxo set for ${process.env.ADDRESS}, skipping`)
    return
  }

  const amount = utxos.reduce((acc, utxo) => utxo.satoshis + acc, 0)

  const transaction = new Transaction();

  transaction.from(utxos)
  transaction.to(process.env.ADDRESS, amount)

  const size = Buffer.from(transaction.toString(), 'hex').length
  const duffPerByte = 5;
  const fee = size * duffPerByte

  transaction.clearOutputs()
  transaction.to(process.env.ADDRESS, amount - fee)
  transaction.fee(fee)

  transaction.sign(privateKey)

  const txid = await broadcastTransaction(transaction.toString())

  console.log('Successfully broadcasted transaction ' + txid)

  if (process.env.CRON_SECONDS) {
    setTimeout(main, Number(process.env.CRON_SECONDS) * 1000 );
  }
}

main().catch(console.error)
