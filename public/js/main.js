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

  //usuario marca/desmarca una subtarea
  $("body").on('click', 'input.subtask__checkbox-input', checkSubTask );

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
    console.log(e.currentTarget.id);
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

function editTask(id) {
  // convertir el row de tarea en un form
  // modificar el form y luego al presionar enter, tomar la data del form y convertirla en el row
  // enviar la data del form al servidor de habitica y esperar a por su respuesta

  console.log('edit : ' + id);
  let textTask2 = document.querySelector(id).innerHTML; /* ids no deberían empezar con números */
  let textTask = $("#" + id).html();
  console.log('textTask');
  console.log(textTask);
  console.log('textTask2');
  console.log(textTask2);
  /*
  let noteTask = $("#" + id).siblings().filter('.noteTask')[0].innerHTML;  // el elemento hermano que tiene la clase de noteTask

  let element = $("#" + id).parent(); // donde esta el texto, las notas y las subtareas
  //console.log(element);

  element.empty(); // falta preocuparse por las tareas que tienen subtareas
  element.append(`
    <form class="formEditTask ${id}"> 
      <input type="text" autocomplete="off" value="${textTask}" class="inputEditText ${id}" placeholder="Name of task" required>
      <input type="text" autocomplete="off" value="${noteTask}" class="inputEditNotes ${id}">
      <input type="hidden" class="idTaskTarget" value="${id}">
      <button class="editButton" type="submit"></button>
    </form>
  `);
  */
}

// SUBMITING THE CHANGES TO THE HABITICA SERVER OF EDIT FORM
$("body").on('submit', '.formEditTask', (e) => {
  e.preventDefault();
  changeSync('waiting');
  let id = e.currentTarget.getElementsByClassName('idTaskTarget')[0].defaultValue;
  let nameTask = $(`.inputEditText.${id}`).val(); // document.getElementById('2345').value; //= $('#formEditTask').filter('inputEditText'); //e.currentTarget.getElementsByClassName('inputEditText');
  let noteTask = $(`.inputEditNotes.${id}`).val();

  let targetParent = e.currentTarget.parentNode;
  console.log(targetParent);

  $(".formEditTask").empty();
  targetParent.insertBefore(`
    <p class="row-task__task-name mb-0" id="${id}">${nameTask} </p>
    <p class="task-difficulty mb-2">dificultad</p> 
    <p class="row-task__note-task mb-0">${nameTask}</p>
  `, null);

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: window.location.href + "updateTask",
    data: { id: id, nameTask: nameTask, noteTask: noteTask },
    success: (reply) => {
      console.log(reply);
      let body = JSON.parse(reply.dataResponse.body);
      if (body.success == true) {
        changeSync('ok');
        //let data = body.data;
        //console.log(`HP : ${data.hp}, MP : ${data.hp}, XP : ${data.exp}, LVL : ${data.lvl}, GP : ${data.gp}`);
      }
      else {
        changeSync('error');
      }
    },
    error: (reply) => {
      console.log(reply);
      changeSync('error');
    }
  });
});

/* ------- EDIT TASK - END --------- */

