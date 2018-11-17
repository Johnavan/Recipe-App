let express = require('express')
const https = require('https')
const API_KEY = 'dea4dc8a0b4924b2c0d98d580f15f5c0'

let router = express.Router()

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Food 4 U'
  })
})

router.get('/recipes', function(req, res, next) {
  let ingredient = req.query.ingredient
  getRecipe(ingredient, res);
})

router.post('/recipes', function(req, res) {
  var obj = {
    ingredient: req.body.ingredient
  }

  getRecipe(obj.ingredient, res);
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
    res.render('index', {
      title: 'Enjoy your meal',
      items: obj.recipes
    })
  }
}

module.exports = router