let express = require('express')
let bodyParser = require('body-parser')
let qstring = require('querystring')
let url = require('url')
const https = require('https')
const API_KEY = 'dea4dc8a0b4924b2c0d98d580f15f5c0'

let router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
  extended: false
}))

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Food 4 U',
    items: '',
    url: '',
    images: ''
  })
})

router.get('/recipes.html', function(req, res) {
  res.render('index', {
    title: 'Food 4 U',
    items: '',
    url: '',
    images: ''
  })
  })

  router.get('/index.html', function(req, res) {
    res.render('index', {
      title: 'Food 4 U',
      items: '',
      url: '',
      images: ''
    })
    })


router.get('/recipes', function(req, res, next) {
  let requestURL = req.url
  let query = url.parse(requestURL).query
  let queryParams = qstring.parse(query)
  let ingredient = queryParams.ingredients
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

  let obj_url = {}
  let obj_img = {}
  let obj_title = {}

  if (data) {
    let obj = JSON.parse(data)
    let items = obj.recipes

    for (recipes in items) {
      obj_url[recipes] = items[recipes].f2f_url
      obj_img[recipes] = items[recipes].image_url
      obj_title[recipes] = items[recipes].title
    }


    res.render('index', {
      title: 'Enjoy your meal',
      items: obj.recipes,
      url: obj_url,
      images: obj_img,
      recipeTitle: obj_title

    })
  }
}

module.exports = router
