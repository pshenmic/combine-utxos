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
    const { result } = response.json()

    return result
  } else {
    const text = await response.text()

    throw new Error(text)
  }
}

const getAddressUtxos = async (address) => {
  return requestRpc('getaddressutxos', {addresses: {addresses: [address]}})
}

const broadcastTransaction = async (hex) => {
  return requestRpc('sendrawtransaction', [hex])
}

module.exports = {
  getAddressUtxos,
  broadcastTransaction
}
