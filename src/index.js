const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  if(!users.some((userFinded)=> userFinded.username == username)){
    return response.status(404).json({message:"User not exists."})
  }
  request.username = username;
  next();
  // Complete aqui
}

app.post('/users',(request, response) => {
  // Complete aqui
  const {username} = request.headers;

  if(users.some((userFinded)=> userFinded.username == username)){
    return response.status(409).json({message:"User already exists."})
  }

  const {name} = request.body;
  const newUser = {
    id:uuidv4(),
    name,
    username,
    todos:[]
  }
  users.push(newUser);

 return response.status(201).json({newUser});

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request;

  const userFinded = users.filter((user)=> user.username == username);

  return response.status(200).json({todo:[userFinded.todos]});
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request;
  const {title,deadline} = request.body;

  const newTodo = {
    id:uuidv4(),
    title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  const userFinded = users.filter((user)=> user.username == username);
  userFinded[0].todos.push(newTodo);
  return response.status(201).json(userFinded);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request;
  const {title,deadline} = request.body;
  const {id} = request.params;
  const user = users.filter((user)=> user.username == username);

  const novoTodos = user[0].todos.map((todo)=> todo.id === id ?{
    ...todo,
    title:title,
    deadline:new Date(deadline)
  }:todo);
  user[0].todos = novoTodos;
  
  return response.status(201).json(user);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request;
  const {id} = request.params;

  const userFinded = users.find((user)=> user.username == username);

  const todoUser = userFinded.todos.map((todo)=> todo.id == id? {
    ...todo,
    done:true
  }:todo)
  userFinded.todos = todoUser;

  return response.status(201).json(todoUser);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request;
  const {id} = request.params;

  const userFinded = users.find((user)=> user.username == username);
  const newTodos = userFinded.todos.map((todo,index)=> todo.id == id?()=>{
    userFinded.todos.splice(index,1);
  }:todo)

  userFinded.todos = newTodos;

  return response.status(200).json(userFinded);
});
app.listen(3000,()=> console.log("Server running at port 3000."))
module.exports = app;