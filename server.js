// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
var todos = [
  { _id: 7, task: 'Laundry', description: 'Wash clothes' },
  { _id: 27, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
  { _id: 44, task: 'Homework', description: 'Make this app super awesome!' }
];


var data = {
  todos
};

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 *
 * The comments below give you an idea of the expected functionality
 * that you need to build. These are basic descriptions, for more
 * specifications, see the todosTest.js file and the outputs of running
 * the tests to see the exact details. BUILD THE FUNCTIONALITY IN THE
 * ORDER THAT THE TESTS DICTATE.
 */

app.get('/api/todos/search', function search(req, res) {
  /* This endpoint responds with the search results from the
   * query in the request. COMPLETE THIS ENDPOINT LAST.
   */
   var searchTerm = req.query.q;

   function getdata(){
     //for loop to loop through objects in todos
     for(var i = 0; i < todos.length; i ++){
       // split task values into individual words and place in an array
       var taskStrArr = data.todos[i].task.split(' ');
       var match = false;
       // forEach method to loop through  taskStrArr array and switch match to true if equallity is detected
       taskStrArr.forEach(function(ele,idx,arr){
          if(taskStrArr === ele){
            match = true;
          }
       });
       //if equallity is not detected splice out the object that doesn't match
       if(match){
         data.todos.splice(i,1);
       }
     }
     //return data with non matching objects spliced out of todos array.
     return data;
   }
   //call search function 
   res.send(getdata());
});

app.get('/api/todos', function index(req, res) {
  /* This endpoint responds with all of the todos
   */

   res.send(data);

});

app.post('/api/todos', function create(req, res) {
  /* This endpoint will add a todo to our "database"
   * and respond with the newly created todo.
   */
   var lastID = data.todos[todos.length-1]._id
   var task = req.body.task;
   var description = req.body.description;
   var newTask = {_id: (lastID + 1), task: task, description: description};
   data.todos.push(newTask);
   res.send(newTask);
});

app.get('/api/todos/:id', function show(req, res) {
  /* This endpoint will return a single todo with the
   * id specified in the route parameter (:id)
   */
   var currentID = parseInt(req.params.id);
   function getid(){
     for(var i = 0; i < todos.length; i ++){
       if (data.todos[i]._id === currentID){
         return data.todos[i]
       }
     }
     return "sorry we can't fint that task";
  }

   res.send(getid())


});

app.put('/api/todos/:id', function update(req, res) {
  /* This endpoint will update a single todo with the
   * id specified in the route parameter (:id) and respond
   * with the newly updated todo.
   */
   var currentID = parseInt(req.params.id);
   var newTask = req.body.task;
   var newDescrip = req.body.description

   function update(){
     for(var i = 0; i < todos.length; i ++){
       if (data.todos[i]._id === currentID){
          data.todos[i].task = newTask;
          data.todos[i].description = newDescrip;
          return data.todos[i];
       }
     }
   }
   res.send(update());
});

app.delete('/api/todos/:id', function destroy(req, res) {
  /* This endpoint will delete a single todo with the
   * id specified in the route parameter (:id) and respond
   * with success.
   */
   var deleteId = parseInt(req.params.id);
   for(var i = 0; i < todos.length; i ++){
     if (data.todos[i]._id === deleteId){
       data.todos.splice(i, 1);
     }
   }
   res.send(data);



});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});
