$("document").ready(() => {

  //usuario cambia dificultad de nuevas tareas
  let formDifs = document.querySelectorAll('#addTaskContainer span.task-difficulty');
  for (let i = 0; i < formDifs.length; i++) 
    formDifs[i].addEventListener('click', changeActiveDif);

  //usuario agrega nueva tarea
  document.getElementById('formAddTask').addEventListener('submit', enterNewTask);

  //usuario checkea una tarea haciendo doble click
  $("body").on('dblclick', `p.row-task__task-name`, checkTask);

  //usuario borra una tarea (incluso dinamicamente generada)
  $("body").on('click', 'i.deleteTaskId', deleteTask);

  //usuario desea agregar nueva subtarea (incluso a tareas dinamicamente generadas)
  $("body").on('click', 'i.addSubTaskId', addSubTask );

  //usuario desea editar una tarea
  $("body").on('click', 'i.editTaskId', editTask );

  //usuario marca/desmarca una subtarea
  $("body").on('click', 'input.subtask__checkbox-input', checkSubTask );

  $("#containerTasks").sortable(
    {
      handle : ".vertical-control-jquery-ui" // elemento quien dirige la propiedad sortable
    }
  );

  

});

// ADD TODO - START
function enterNewTask(e) {
  e.preventDefault();
  changeSync('waiting');
  let textNewTask = document.getElementById('textNewTask');
  let result = separateTaskAndNotes(textNewTask.value);

  let data = {
    nameNewTask: result.nameNewTask,
    nameNoteTask: result.nameNoteTask,
    priority: getPriority()
  }

  makeRequest('POST', 'addTask', data, sucessAddTask); // method, route, data(json), successFunction
  textNewTask.value = '';
};

// CHECK TODO - START
function checkTask(e) {
  changeSync('waiting');
  let id = e.currentTarget.id;
  $("#" + id).parent().parent().parent().remove();
  let idNew = id.slice(11); // ej: taskNameId-89093e59-12f2-4371-958e-37e5084acee4
  let data = { id: idNew };
  makeRequest('POST', 'checkTask', data, successCheckTask); // method, route, data(json), successFunction
}

// DELETE TODO - START
function deleteTask(e) {
  changeSync('waiting');
  let id = e.currentTarget.id; //deleteTaskId-89093e59-12f2-4371-958e-37e5084acee4
  $("#" + id).parent().parent().remove();
  let idNew = id.slice(13);
  let data = { id: idNew };
  makeRequest('POST', 'deleteTask', data); // method, route, data(json), successFunction
}

// ADD SUB TASK TODO - START
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addSubTask(e) {
  let id = e.currentTarget.id; //addSubTaskId-89093e59-12f2-4371-958e-37e5084acee4
  id = id.slice(13);
  //let target = e.currentTarget.parentNode.parentNode.firstElementChild;

  $('#checklist-'+id).append(`
    <form class="form-sub-task ml-2">
      <span class="subtask__checkbox-button"></span>
      <input id="newSubTask-${id}" class="form-sub-task__input" type="text" placeholder="Add new subtask" onkeypress="return enterAddSubTask(event,id,value)">
    </form>`);
}

function enterAddSubTask(e,id,value) {
  if (e.keyCode == 13) {
    changeSync('waiting');
    e.preventDefault();
    
    let id = e.currentTarget.id; //newSubTask-89093e59-12f2-4371-958e-37e5084acee4
    id = id.slice(11);

    let data = {
      id : id,
      textSubTask : value,
    }

    makeRequest('POST', 'addSubTask', data, successAddSubTask);
  }

}

//CHECK SUB TASK - START
function checkSubTask(e){
  let idParent = e.currentTarget.parentNode.parentNode.id; // checklist-96c45c95-f563-4a7a-811c-7cb41e6fa981
  idParent = idParent.slice(10);
  
  let idChecklist = e.currentTarget.id; // checkboxId-a4772d93-bf92-43af-9b9a-3f7f54a8ce29
  idChecklist = idChecklist.slice(11);
  
  let data = {
    idTask : idParent,
    idSubTask : idChecklist
  }
  changeSync('waiting');
  makeRequest('POST', 'checkSubTask', data);
}



/* ------- EDIT TASK _START --------- */

function editTask(e) {
  // cambiar el contenido del rowTask y ponerle en un form
  let id = e.currentTarget.id; // editTaskId-2f5a36e2-fb51-4efc-a801-63aa4ce58de6
  id = id.slice(11);

  let rowTarget = $(`#rowTask-${id}`);

  let textTask = rowTarget.children().first()[0].innerText;
  let noteTask = rowTarget.children().last()[0].innerText; // asi no tenga texto, igual el elemento esta

  rowTarget.empty(); // or children().remove(); 
    
  rowTarget.append(`
    <form id="formEditTask-${id}" class="form-edit-task"> 
      <input type="text" autocomplete="off" value="${textTask}" class="inputEditText" placeholder="Name of task" required>
      <input type="text" autocomplete="off" value="${noteTask}" class="inputEditNotes" placeholder="Notes from task">
      <button class="editButton" type="submit">Submit</button>
    </form>
  `)
}

// SUBMITING THE CHANGES TO THE HABITICA SERVER OF EDIT FORM
$("body").on('submit', '.form-edit-task', (e) => {
  e.preventDefault();

  // conseguir los valores de los inputs
  let id = e.currentTarget.id; // formEditTask-2f5a36e2-fb51-4efc-a801-63aa4ce58de6
  id = id.slice(13);
  let newNameTask = document.querySelector(`#formEditTask-${id} input.inputEditText`).value;
  let newNoteTask = document.querySelector(`#formEditTask-${id} input.inputEditNotes`).value;
  let data = { id: id, nameTask: newNameTask, noteTask: newNoteTask }

  //deberia verificarse que no se deja la tarea vacia...

  
  // mandar el request y esperar a por la respuesta
  changeSync('waiting');
  makeRequest('POST', 'updateTask', data, successUpdateTask);
});

/* ------- EDIT TASK - END --------- */

