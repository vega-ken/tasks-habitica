$("document").ready(() => {

  //usuario cambia dificultad de nuevas tareas
  let formDifs = document.querySelectorAll('#addTaskContainer span.taskDif');
  for(let i = 0; i < formDifs.length; i++){
    formDifs[i].addEventListener('click', changeActiveDif);
  }

  //usuario agrega nueva tarea
  document.getElementById('formAddTask').addEventListener('submit', enterNewTask);
    // antes :: $("#formAddTask").on('submit', (e) => { });

  //check the task by doubleClicking

  
  //CHECK THE TASK
  $("body").on('dblclick', `p.taskName`, (e) => {
    let id = e.currentTarget.getAttribute('id');
    let idNew = id.slice(11); // taskNameId-89093e59-12f2-4371-958e-37e5084acee4
    changeSync('waiting');
    $("#" + id).parent().parent().remove(); // remover la fila entera de esa tarea
    let data = { id: idNew };
    makeRequest('POST','checkTask',data, successCheckTask);
  });

  // ---- ADDING EVENTS ---

  //DELETE EVENTS
  let deleteTasksButtons = document.querySelectorAll('.deleteTaskId');
  for (let i = 0 ; i < deleteTasksButtons.length ; i++){
    deleteTasksButtons[i].addEventListener('click', deleteTask);
  }

  //ADD SUB TASK EVENTS
  let addSubTaskButtons = document.querySelectorAll('.addSubTaskId');
  for (let i = 0 ; i < addSubTaskButtons.length ; i++){
    addSubTaskButtons[i].addEventListener('click', addSubTask);
  }

});

function enterNewTask(e){
  e.preventDefault();
  changeSync('waiting');
  let textNewTask = document.getElementById('textNewTask');

  let result = separateTaskAndNotes(textNewTask.value);

  let data = {
    nameNewTask: result.nameNewTask,
    nameNoteTask: result.nameNoteTask,
    priority: getPriority()
  }

  makeRequest('POST', 'addTask', data, sucessAddTask); // method, route, data(json), function
  textNewTask.value = '';
};




function successCheckTask(data){
  console.log(`HP : ${data.hp}, MP : ${data.hp}, XP : ${data.exp}, LVL : ${data.lvl}, GP : ${data.gp}`);
  let result = document.getElementById('statsText');
  result.innerHTML = `HP : ${data.hp}, MP : ${data.hp}, XP : ${data.exp}, LVL : ${data.lvl}, GP : ${data.gp}`;
}


function addSubTask(e){
  changeSync('waiting');
  console.log(e.currentTarget);
  //el padre, el padre : ese es el contendor de toda la fila tarea
  // luego el primer hijo es donde se agrega el form. asi que es target
  let id = e.currentTarget.id; //addSubTaskId-89093e59-12f2-4371-958e-37e5084acee4
  let target = e.currentTarget.parentNode.parentNode.firstElementChild;
  console.log(target);

  // ya con el target, creas el elemento

  target.append(
    `<form class='formnewsubtask'>
      <input type='text' placeholder='Add new subtask' autocomplete='off'/>
    </form>`); // onkeypress='return addTheSubTask(event,id,value)'


}

function enterAddSubTask(id){

}

function deleteTask(e) {  // works.. with an error but works
  changeSync('waiting');
  let id = e.currentTarget.id; //deleteTaskId-89093e59-12f2-4371-958e-37e5084acee4
  $("#" + id).parent().parent().remove();
  let idNew = id.slice(13);
  let data = { id: idNew };
  makeRequest('POST','deleteTask',data);
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

// SUBMITING THE CHANGES TO THE HABITICA SERVER
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
    <p class="taskName mb-0" id="${id}">${nameTask} </p><p class="taskDif mb-2">dificultad</p> 
    <p class="noteTask mb-0">${nameTask}</p>
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

