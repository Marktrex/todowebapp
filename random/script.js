
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
        const li = document.createElement("ul");  //it will put the text inside
        const deleteBtn = document.createElement("button"); //created a delete button
        deleteBtn.textContent = "❌"; //this will be the design of the delete button
        deleteBtn.onclick = function () { //delete function when clicked, it will remove the data
            todo.splice(index, 1); // this will remove the data clicked on the todo list
            renderList(); //reload/refresh the list but not the actual website
        };

        const textSpan = document.createElement("span"); //just a container for the data/text
        textSpan.textContent = " " + item + " "; //it will add them together

        const completeBtn = document.createElement("button"); //created a complete/check button
        completeBtn.textContent = "✅"; //this will be the design
        completeBtn.onclick = function () { 
            completedTodo.push(item); //THIS CODE will push/move the data from the todo list into the completed list
            todo.splice(index, 1); //will remove it on the todo llist
            renderList(); //refresh list 
        };

        //the text with delete and complete btn
        li.appendChild(deleteBtn);
        li.appendChild(textSpan);
        li.appendChild(completeBtn);

        todoLists.appendChild(li);
    });

    // COMPLETED LIST
    completedTodo.forEach(function (item, index) {
        const li = document.createElement("ul");

        const backBtn = document.createElement("button"); //created a del or back button
        backBtn.textContent = "❌"; 
        backBtn.onclick = function () {
            todo.push(item); //this wil push the completed item back to the todo list
            completedTodo.splice(index, 1);
            renderList();
        };

        const textSpan = document.createElement("span"); //cointainer for the text with btns
        textSpan.textContent = " " + item + " ";

        const removeBtn = document.createElement("button"); //button for the remove
        removeBtn.textContent = "✅";
        removeBtn.onclick = function () {
            completedTodo.splice(index, 1); //this will remove the completed todo in the list
            renderList();
        };

        //text with the btns
        li.appendChild(backBtn);
        li.appendChild(textSpan);
        li.appendChild(removeBtn);

        completedLists.appendChild(li);
    });
};


// Move todo to completed
// function moveToCompleted(index) {
//     const item = todo[index];   // get the item
//     todo.splice(index, 1);      // remove from todo
//     completedTodo.push(item);   // add to completed
//     renderList();
// }

// function removeItem(index){
//     todo.splice(index, 1);
//     renderList();
// }