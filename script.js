/*
System flow
- user type todo + click the add button to trigger the function
- a function that will get the input
- a function or something that will reload and list the todo
- a function that if the todo has been clicked, it will be removed
and refresh the list
*/
let todo = [];
let completedtodo = []

const inputType = document.getElementById("inputType");
const enterBtn = document.getElementById("enterBtn");
const todoLists = document.getElementById("todoLists");
const completedLists = document.getElementById("completedLists");
//Enter button function that adds data in the lists array
enterBtn.addEventListener("click", function(){
    let text = inputType.value; //i am putting the input type value in a variable text

    if(text === "") return; //if the input type is empty, it will not work

    todo.push(text); //this will push or put the data in the lists array
    
    inputType.value = "" //this code is to clear the input type after adding something in the todo list

    renderList(); //we will call the render function
});

//function to render/show the data in the list
function renderList(){
    todoLists.innerHTML = ""; //clears old list

    todo.forEach(function(item, index){ //for loop where itme is the current todo text and index is the position
        const li = document.createElement("li");  //it will put the text inside
        li.textContent = item;

        li.addEventListener("click",function(){ //click to delete, it calls the function remove item when clicked
            removeItem(index);
        });

        todoLists.appendChild(li);
    })
}

// function removeItem(index){
//     todo.splice(index, 1);
//     renderList();
// }