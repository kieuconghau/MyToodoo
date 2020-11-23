"use strict";

// Global variables declaration
var boxAddTask = document.getElementById('box-add-task');
var btnAddTask = document.getElementById('btn-add-task');
var taskList = document.getElementById('task-list');
var btnReset = document.getElementById('btn-reset');

var mode = "add";   // { "add", "edit" }
var editIDNum;
var editPreContent;


// Invoke functions
loadTasksFromLocalStorage();
boxAddTask.focus();
btnAddTask.setAttribute('onclick', 'addBtnEvent(editPreContent)');
btnReset.setAttribute('onclick', 'reset()');


// Functions
function loadTasksFromLocalStorage() {
    for (let i = 0; i < window.localStorage.length; ++i) {
        addTaskItemNode(window.localStorage.getItem(i.toString()), i);
    }
}

function addBtnEvent(oldContent) {
    if (mode == "add") {
        let content = boxAddTask.value;
        let idNum = window.localStorage.length;
        boxAddTask.value = '';

        if (content != '') {
            addTaskItemNode(content, idNum);
            window.localStorage.setItem(idNum, content);
        }
    }
    else if (mode == "edit") {        
        let content = boxAddTask.value;
        let idNum = editIDNum;
        boxAddTask.value = '';

        if (content == '') {
            content = oldContent;
        }

        window.localStorage.setItem(idNum, content);
        mode = "add";
    }
}

function addTaskItemNode(content, idNum) {
    if (content != '') {
        var taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.id = idNum.toString();
        
        var taskContent = document.createElement('p');
        taskContent.className = 'task-content';
        taskContent.setAttribute('onclick', 'editTask(' + taskItem.id + ')')
        taskContent.appendChild(document.createTextNode(content));

        var btnRemoveTask = document.createElement('button');
        btnRemoveTask.className = 'btn-remove-task';
        btnRemoveTask.setAttribute('onclick', 'removeTask(' + taskItem.id + ')');
        btnRemoveTask.appendChild(document.createTextNode('X'));

        taskItem.appendChild(taskContent);
        taskItem.appendChild(btnRemoveTask);

        taskList.appendChild(taskItem);
    }
}

function removeTask(idNum) {
    document.getElementById(idNum.toString()).remove();
    window.localStorage.setItem(idNum, "");
    if (mode == 'edit' && idNum == editIDNum) {
        mode = 'add';
        location.reload();
    }
}

function editTask(idNum) {
    if (editIDNum != null && idNum != editIDNum) {
        let oldTaskItem = document.getElementById(editIDNum.toString());
        let oldTaskContent = oldTaskItem.firstElementChild;
        let oldBtnRemoveTask = oldTaskItem.lastElementChild;
        
        oldBtnRemoveTask.style.visibility = "hidden";
        oldTaskContent.style.backgroundColor = "#FFF8E8";
        oldTaskItem.style.gridTemplateColumns = "auto";
    }

    mode = "edit";
    editIDNum = idNum;

    var taskItem = document.getElementById(idNum.toString());
    var taskContent = taskItem.firstElementChild;
    var btnRemoveTask = taskItem.lastElementChild;

    boxAddTask.value = taskContent.innerHTML;
    boxAddTask.focus();
    editPreContent = boxAddTask.value;
    btnAddTask.innerHTML = 'Edit';

    btnAddTask.style.backgroundColor = "#FFC75F";
    btnAddTask.onmouseover = () => {
        btnAddTask.style.backgroundColor = "#FF9671";
    }
    btnAddTask.onmouseout = () => {
        btnAddTask.style.backgroundColor = "#FFC75F";
    }

    taskItem.style.gridTemplateColumns = "auto 35px";
    taskContent.style.backgroundColor = "#FFEECA";
    btnRemoveTask.style.visibility = "visible";
}

function reset() {
    taskList.innerHTML = "";
    window.localStorage.clear();
    location.reload();
}