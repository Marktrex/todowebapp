
/*
System flow
- user type todo + click the add button to trigger the function
- a function that will get the input
- a function or something that will reload and list the todo
- a function that if the todo has been clicked, it will be removed
and refresh the list
*/
let todo = [];
let completedTodo = [];

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
    completedLists.innerHTML = "";

    todo.forEach(function(item, index){ //for loop where itme is the current todo text and index is the position
        const li = document.createElement("li");  //it will put the text inside
        li.textContent = item;

        li.addEventListener("click",function(){ //click to MOVE, it calls the function MOVE the item when clicked
            moveToCompleted(index);
        });

        todoLists.appendChild(li);
    });

    //to render COMPLETED list
    completedTodo.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        completedLists.appendChild(li);
    });

}

// Move todo to completed
function moveToCompleted(index) {
    const item = todo[index];   // get the item
    todo.splice(index, 1);      // remove from todo
    completedTodo.push(item);   // add to completed
    renderList();
}

// function removeItem(index){
//     todo.splice(index, 1);
//     renderList();
// }