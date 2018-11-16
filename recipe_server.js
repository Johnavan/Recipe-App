const https = require('https') //food2fork now requires https
//let http = require('http')
let url = require('url')
//let qstring = require('querystring')
let express = require('express')
let app = express.Router()
const API_KEY = 'dea4dc8a0b4924b2c0d98d580f15f5c0' //<== INSERT YOUR KEY HERE

//const PORT = process.env.PORT || 3000


app.get('/', function(req, res, next){
  res.render('index', {title: 'food2Fork'})
})

app.post('/recipeDetails', function(req, res) {
    var obj = { ingredient: req.body.ingredient};
    sendRequest(obj.ingredient,res) ;
});

//HTTPS request
function getRecipe(ingredient, res) {

  const options = {
    host: 'www.food2fork.com',
    path: `/api/search?q=${ingredient}&key=${API_KEY}`
 }
 https.request(options, function(apiResponse){
   parseRecipe(apiResponse, res)
 }).end()
}

//response from food2fork api
function parseRecipe(recipeResponse, res) {
  let recipeData = ''
  recipeResponse.on('data', function(chunk) {
    recipeData += chunk
  })
  recipeResponse.on('end', function() {
    sendResponse(recipeData, res)
  })
}

//response to server
function sendResponse(recipeData, res) {

  if (recipeData) {
    console.log(recipeData)
    let info = JSON.parse(info)
    console.log(info)
    res.render('recipeDetails', { title: 'Time for a meal', items: info.recipes });
}
}




/* http.createServer(function(req, res) {
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
}) */
