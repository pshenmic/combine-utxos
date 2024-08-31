const requestRpc = async (method, params) => {
  const response = await fetch(`http://${process.env.RPC_HOST}:${process.env.RPC_PORT}`, {
    headers: new Headers({
      'Authorization': `Basic ${btoa(process.env.RPC_USER + ':' + process.env.RPC_PASSWORD)}`,
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    body: JSON.stringify({method, params})
  })

  if (response.status === 200) {
    return response.json()
  } else {
    const text = await response.text()

    throw new Error(text)
  }
}

const getAddressUtxos = async (address) => {
  const utxos = await requestRpc('getaddressutxos', {addresses: {addresses: [address]}})
  console.log(utxos)
  return utxos
}

const broadcastTransaction = async (hex) => {
  return requestRpc('sendrawtransaction', [hex])
}

module.exports = {
  getAddressUtxos,
  broadcastTransaction
}
