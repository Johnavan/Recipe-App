let express = require('express')
let bodyParser = require('body-parser')
let path = require('path')

let routing = require('./routes/index')

let app = express()


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', routing);

//Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Set Static path
app.use(express.static(path.join(__dirname, 'public')))


app.listen(3000,function(){
  console.log('Server Started on Port 3000')
})
