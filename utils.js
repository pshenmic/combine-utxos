const requestRpc = async (method, params) => {
  const response = await fetch(`http://${RPC_USER}:${RPC_PASSWORD}@${RPC_HOST}:${RPC_PORT}`, {
    headers: {
      'content-type' : 'application/json'
    },
    body: JSON.stringify({method, params})
  })

  if(response.status === 200) {
    const {result} = response.json()

    return result
  } else {
    const text = await response.text()

    throw new Error(text)
  }
}

const getAddressUtxos = async (address) => {
  return requestRpc('sendrawtransaction', {"addresses": [process.env.ADDRESS]})
}

const broadcastTransaction = async (hex) => {
  return requestRpc('sendrawtransaction', [hex])
}

module.exports = {
  getAddressUtxos,
  broadcastTransaction
}
