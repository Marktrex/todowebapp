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
    let text = inputType.value; //i am putting the input type value in a variable text

    if(text === "") return; //if the input type is empty, it will not work

    lists.push(text); //this will push or put the data in the lists array
    
    todoLists.innerHTML = lists.join("<br>");

    inputType.value = "" //this code is to clear the input type after adding something in the todo list
});

