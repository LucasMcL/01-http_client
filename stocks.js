'use strict'

// Todo: handle inputs that are not valid ticker symbols

const {get} = require('http')

const { argv: [,,ticker] } = require('process')
const URL = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"${ticker}","Type":"price","Params":["c"]}]}`

get(URL, res => {
	let rawData = ''

  const statusCode = res.statusCode
  const contentType = res.headers['content-type']
  console.log(statusCode)
  console.log(contentType)



  res.on('data', (chunk) => rawData += chunk)
  res.on('end', () => {
    try {
      let parsedData = JSON.parse(rawData)
			let prices = parsedData.Elements[0].DataSeries.close.values
			console.log(`The average stock price for ${ticker} last year was: ${averagePrices(prices)}`)
    } catch (e) {
      console.log('Error: ' + e)
    }
  })

	function averagePrices(prices) {
		let sum = prices.reduce((acc, val) => acc + val)
		let avg = sum / prices.length
		avg = avg.toFixed(2)
		return avg
  }
})









