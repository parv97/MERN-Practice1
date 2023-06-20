/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */

class ToDo{
  static counterId = 1;
  constructor(title, description){
    this.id = ToDo.counterId;
    this.title = title;
    this.description = description;
    this.completed = false;
    ToDo.counterId+=1;
  }
  getId(){
    return this.id;
  }
  getTitle(){
    return this.title;
  }
  setTitle(title){
    this.title = title;
  }
  getDescription(description){
    return this.description;
  }
  setDescription(description){
    this.description = description;
  }
  getCompleted(completed){
    return this.completed;
  }
  setcompleted(completed){
    this.completed = completed;
  }
  static getCurrentCounterId(){
    return ToDo.counterId;
  }

}

const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();

app.use(bodyParser.json());

var toDoList = [];

app.get('/todos', handleGetTodo);
app.get('/todos/:id', handleGetTodoById);
app.post('/todos', handleCreateTodo);
app.put('/todos/:id', handleUpdateTodo);
app.delete('/todos/:id', handleDeleteTodo);

app.listen(port, () => {
  console.log(`ToDo app listening on port ${port}`)
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

function handleGetTodo(req, res){
    res.json(toDoList);
}

function handleGetTodoById(req, res){
  var id = parseInt(req.params.id);
  for(let i = 0; i < toDoList.length; i++){
    if(toDoList[i].getId() === id){
      res.json(toDoList[i]);
      return;
    }
  }
  res.status(404).send("TODO item with id "+id+" not found!");
}

function handleCreateTodo(req, res){
    var title =  req.body.title;
    var description =  req.body.description;

    const toDoObj = new ToDo(title,description);
    toDoList.push(toDoObj);
    res.status(201).json({id : toDoObj.getId()});
}

function handleUpdateTodo(req, res){
  var id =  parseInt(req.params.id);
  var title =  req.body.title;
  var description =  req.body.description;
  var completed =  req.body.completed;

  for(let i = 0; i < toDoList.length; i++){
    if(toDoList[i].getId() === id){
      toDoList[i].setTitle(title);
      toDoList[i].setDescription(description);
      toDoList[i].setcompleted(completed);
      res.send("TODO item with ID "+id+" updated !");
      return;
    }
  }
  res.status(404).send("TODO with id "+id+" not found !");
}

function handleDeleteTodo(req, res){
  var id = parseInt(req.params.id);
  for(let i = 0; i < toDoList.length; i++){
    if(toDoList[i].getId() === id){
      toDoList.splice(i,1);
      res.status(200).send("TODO with id "+id+" deleted !");
      return;
    }
  }
  res.status(404).send("TODO with id "+id+" not found !");
}

module.exports = app;
