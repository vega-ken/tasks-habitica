$("document").ready(() => {

  //CAMBIO DE DIFICULTAD PARA NUEVA TAREA
  let formDifs = document.querySelectorAll('#addTaskContainer span.taskDif');
  // a los 4 les agrego un evento de cuando son clickeados, agregarles la clase
  for(let i = 0; i < formDifs.length; i++){
    formDifs[i].addEventListener('click', changeActiveDif);
  }

  //PRESIONA ENTER EN ENTRADA
  $("#formAddTask").on('submit', (e) => {
    e.preventDefault();
    changeSync('waiting');
    let textNewTask = $("#textNewTask").val();
    let indexNoteTask = textNewTask.indexOf('|');
    let result = gettingTaskSliced(textNewTask, indexNoteTask);

    let nameNewTask = result.nameNewTask;
    let nameNoteTask = result.nameNoteTask;

    let priority = getPriority();

    let data = {
      nameNewTask: nameNewTask,
      nameNoteTask: nameNoteTask,
      priority: priority
    }

    makeRequest('POST', 'addTask', data, sucessAddTask); // method, route, data(json), function
    $("#textNewTask").val('');
  });

  //check the task by doubleClicking
  $("body").on('dblclick', `p.taskName`, (e) => {
    let id = e.currentTarget.getAttribute('id');
    changeSync('waiting');
    $("#" + id).parent().parent().remove(); // remover la fila entera de esa tarea
    let data = { id: id };
    makeRequest('POST','checkTask',data, successCheckTask);
  });

});



function sucessAddTask(data){
  let priorityTask = convertPriorityToText(data.priority);
  let notesReply;
  if (data.notes) 
    notesReply = `<p class="noteTask mb-0">${data.notes}</p>`;
  else
    notesReply = ``;
  
  //agregarlo a la vista
  $("#containerTasks").prepend(`
  <div class="row rowTask pt-2 pb-2">
    <div class="col-8 col-xs-8 col-sm-8 col-md-8 col-lg-8">        
      <p class="taskName mb-0" id="${data.id}">${data.text} </p><p class="taskDif task${priorityTask} mb-2">${priorityTask}</p> 
      ${notesReply}
    </div>

    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
      <i class='fa fa-plus action-buttons'></i>
    </div>
    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
      <i class='fa fa-pencil-square-o action-buttons' onclick="editTask('${data.id}')"></i>
    </div>
    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
      <i class='fa fa-trash action-buttons' onclick="deleteTask('${data.id}')"></i>
    </div>
    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
      <i class='fa fa-arrows-v action-buttons'></i>
    </div>

  </div>
  `); // todo : onclick -> debería estar en js como eventListener y no en html
}

function successCheckTask(data){
  //console.log('logro chequear la tarea a traves de una funcion que llama una funcion');
  console.log(`HP : ${data.hp}, MP : ${data.hp}, XP : ${data.exp}, LVL : ${data.lvl}, GP : ${data.gp}`);
  let result = document.getElementById('statsText');
  result.innerHTML = `HP : ${data.hp}, MP : ${data.hp}, XP : ${data.exp}, LVL : ${data.lvl}, GP : ${data.gp}`;
}


function getPriority(){
  let priority = document.querySelector('.taskDifActive').innerHTML;
  priority = changePriorityToNumber(priority)
  return priority;
}






function changeActiveDif(e){
  //buscar el span con la clase active y quitarsela
  let oldTarget = document.querySelector('#addTaskContainer span.taskDifActive');
  oldTarget.classList.remove('taskDifActive');
  //agregar la clase taskDifActive al target seleccionado 
  e.target.className += ' taskDifActive';
}

function deleteTask(id) {
  changeSync('waiting');
  $("#" + id).parent().parent().remove();
  let data = { id: id };
  makeRequest('POST','deleteTask',data);
}

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

