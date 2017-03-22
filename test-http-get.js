const { get } = require('http')

get('http://nodejs.org/dist/index.json', (res) => {
  const statusCode = res.statusCode
  const contentType = res.headers['content-type']

  // let keys = Object.keys(res)
  // console.log('response object keys', keys)
  // console.log('readable: ', res.readable)
  // console.log('domain: ', res.domain)
  // console.log('complete: ', res.complete) // returns false at the beginning
  // console.log('headers: ', res.headers)
  //   // date, content-type, content
  // console.log('trailers: ', res.trailers)
  // console.log('upgrade: ', res.upgrade) // T/F
  // console.log('url: ', res.url)
  // console.log('method: ', res.method)
  // console.log('statusCode', res.statusCode) // 200 is good
  // console.log('statusMessage', res.statusMessage)

  let error
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`)
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`)
  }
  if (error) {
    console.log(error.message)
    // consume response data to free up memory, since we won't use the request body. Until the data is consumed, the 'end' event will not fire. Also, until the data is read it will consume memory that can eventually lead to a 'process out of memory' error.
    res.resume()
    return
  }

  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => rawData += chunk)
  res.on('end', () => {
    try {
      let parsedData = JSON.parse(rawData)
      console.log(parsedData)
    } catch (e) {
      console.log('Error: ' + e.message)
    }
  })
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`)
})
