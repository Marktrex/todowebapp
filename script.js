/*
System flow
- user type todo + click the add button to trigger the function
- a function that will get the input
- a function or something that will reload and list the todo
- a function that if the todo has been clicked, it will be removed
and refresh the list
*/
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

let todos = [];

function addTodoList(){
 const text = todoInput.value;

 if (text === "") {
    return;
 } else {
    todos.push({
        text:text,
        completed:false,
    })
 }
};

