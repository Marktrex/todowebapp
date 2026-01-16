/*
System flow
- user type todo + click the add button to trigger the function
- a function that will get the input
- a function or something that will reload and list the todo
- a function that if the todo has been clicked, it will be removed
and refresh the list
*/
let lists = [];

const inputType = document.getElementById("inputType");
const enterBtn = document.getElementById("enterBtn");
const todoLists = document.getElementById("todoLists");

//Enter button function
enterBtn.addEventListener("click", function(){
    let text = inputType.value;

    if(text === "") return;

    
});

