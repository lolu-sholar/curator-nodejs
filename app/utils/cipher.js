const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const config = require('../manager/config')

// Encrypt
const encrypt = (value) => {
  try {
    // Bounce back if no data
    if (!String(value).trim().length) return ''

  	// Get needle and iv
  	let needle = CryptoJS.enc.Utf8.parse(config.env().CRYPTOJS_NEEDLE),
  			iv = CryptoJS.enc.Utf8.parse(config.env().CRYPTOJS_INITIALIZATION_VECTOR)

    // Return cipher
    return CryptoJS.AES.encrypt(String(value), needle, { iv }).toString()
  } catch {
    return ''
  }
}

// Decrypt
const decrypt = (value) => {
  try {
    // Bounce back if no data
    if (!String(value).trim().length) return ''

  	// Get needle and iv
  	let needle = CryptoJS.enc.Utf8.parse(config.env().CRYPTOJS_NEEDLE),
  			iv = CryptoJS.enc.Utf8.parse(config.env().CRYPTOJS_INITIALIZATION_VECTOR)

    // Return plaintext
    return CryptoJS.AES.decrypt(value, needle, { iv }).toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

// Encrypt or decrypt structure
const encryptOrDecryptData = (payload, decryptStatus = false, exempt) => {
  // Get type
  let type = typeof payload == 'object' 
    ? isNaN(payload.length) 
      ? (payload == null 
        ? 'null' : 'object') : 'array'
    : typeof payload

  // Check if null
  if (type == 'null')
    return ''

  // Check type
  if (!['object', 'array'].includes(type))
    return (!decryptStatus 
      ? encrypt(String(payload))
      : decrypt(String(payload)))

  // Define stores
  let resultsIfArray = [],
      resultsIfObject = {}

  // Check type
  switch (type) {
    case 'array':
      // Loop through array
      for (let key of payload)
        resultsIfArray.push(encryptOrDecryptData(key, decryptStatus))
      break
    case 'object':
      // Loop through object
      for (let key in payload) {
        resultsIfObject[key] = (exempt && exempt.includes(key)) 
          ? payload[key]
          : encryptOrDecryptData(payload[key], decryptStatus)
      }
      break
  }

  // Return data
  return (resultsIfArray.length 
    ? resultsIfArray : resultsIfObject)
}

module.exports = { encrypt, decrypt, encryptOrDecryptData }