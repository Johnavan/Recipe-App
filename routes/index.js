let express = require('express')
let bodyParser = require('body-parser')
const https = require('https')
const API_KEY = '34fcbe59a99ae8b938944b5886537c60'

let router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
  extended: false
}))

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Food 4 U',
    items: ''
  })
})

router.get('/recipes', function(req, res, next) {
  let ingredient = req.query.ingredient
  getRecipe(ingredient, res);
})

router.post('/recipes', function(req, res) {
  var obj = {
    searchBar: req.body.searchBar
  }
  getRecipe(obj.searchBar, res);


})

function getRecipe(ingredient, res) {

  const options = {
    host: 'www.food2fork.com',
    path: `/api/search?q=${ingredient}&key=${API_KEY}`
  }
  https.request(options, function(apiResponse) {
    parseRecipe(apiResponse, res)
  }).end()
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

function sendResponse(data, res) {

  if (data) {
    let obj = JSON.parse(data)
    console.log(obj.recipes)
    res.render('index', {
      title: 'Enjoy your meal',
      items: obj.recipes
    })
  }
}

module.exports = router
