
const https = require('https') //food2fork now requires https
let http = require('http')
let url = require('url')
let qstring = require('querystring')
//let express = require('express')
//let app = express()

const PORT = process.env.PORT || 3000

const API_KEY = 'dea4dc8a0b4924b2c0d98d580f15f5c0' //<== INSERT YOUR KEY HERE

function sendResponse(recipeData, res) {
  var page = '<html><head><title>Food 4 U</title></head>' +
    '<body>' +
    '<form method="post">' +
    'Enter Recipe: <input name="ingredient"><br>' +
    '<input type="submit" value="Get Recipe">' +
    '</form>'
  if (recipeData) {
    let info = recipeData
    page += '<h1>Recipes for </h1><p>' + info + '</p>'
  }
  page += '</body></html>'
  res.end(page);
}

function parseRecipe(recipeResponse, res) {
  let recipeData = ''
  recipeResponse.on('data', function(chunk) {
    recipeData += chunk
  })
  recipeResponse.on('end', function() {
    sendResponse(recipeData, res)
  })
}

function getRecipe(ingredient, res) {

  const options = {
    host: 'www.food2fork.com',
    path: `/api/search?q=${ingredient}&key=${API_KEY}`
 }
 https.request(options, function(apiResponse){
   parseRecipe(apiResponse, res)
 }).end()
}

http.createServer(function(req, res) {
  let requestURL = req.url
  let query = url.parse(requestURL).query //GET method query parameters if any
  let method = req.method
  console.log(`${method}: ${requestURL}`)
  console.log(`query: ${query}`) //GET method query parameters if any

  if (req.method == "POST") {
    let reqData = ''
    req.on('data', function(chunk) {
      reqData += chunk
    })
    req.on('end', function() {
      console.log(reqData);
      var queryParams = qstring.parse(reqData)
      console.log(queryParams)
      getRecipe(queryParams.ingredient, res)
    }) } else if (req.method == "GET") {
      let reqData = ''
      req.on('data', function(chunk) {
        reqData += chunk
      })
      req.on('end', function() {
        var queryParams = qstring.parse(reqData)
        var ingredient = queryParams.ingredient
        console.log(queryParams)
        getRecipe(ingredient, res)
      })
  } else {
    sendResponse(null, res)
  }
}).listen(PORT, (error) => {
  if (error)
    return console.log(error)
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
  console.log(`To Test:`)
  console.log(`http://localhost:3000/`)
})
