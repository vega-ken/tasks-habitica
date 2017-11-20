function changeSync(state) {
  if (state == 'waiting') {
    //cambiar clase a waiting. fa fa-2x fa-refresh fa-spin ml-auto . syncIcon
    $("#syncIcon").removeClass();
    $("#syncIcon").addClass("fa fa-2x fa-spinner fa-spin");
  }
  else if (state == 'ok') {
    //cambiar clase a original. fa fa-2x fa-check-circle-o ml-auto
    $("#syncIcon").removeClass();
    $("#syncIcon").addClass("fa fa-2x fa-check-circle-o");
  }
  else {
    //cambiar clase a error
    $("#syncIcon").removeClass();
    $("#syncIcon").addClass("fa fa-2x fa-exclamation-circle");
  }
}

function changePriorityToNumber(priorityText){
  if (priorityText == "Hard") return 2;
  else if (priorityText == "Medium") return 1.5;
  else if (priorityText == "Easy") return 1;
  else return 0.1;
}

function convertPriorityToText(priorityNumber) {
  if (priorityNumber == 2) return "Hard";
  else if (priorityNumber == 1.5) return "Medium";
  else if (priorityNumber == 1) return "Easy";
  else return "Trivial";
}

function separateTaskAndNotes(textNewTask){
  let nameNewTask;
  let nameNoteTask;
  let indexNoteTask = textNewTask.indexOf('|');

  if (indexNoteTask !== -1) {
    nameNewTask = textNewTask.charAt(0).toUpperCase() + textNewTask.slice(1, (indexNoteTask - 1));
    nameNoteTask = textNewTask.slice(indexNoteTask + 2);
  }
  else {
    nameNewTask = textNewTask.charAt(0).toUpperCase() + textNewTask.slice(1);
    nameNoteTask = "";
  }

  let result = {
    nameNewTask: nameNewTask,
    nameNoteTask: nameNoteTask
  }
  return result;
}

function changeActiveDif(e){
  //buscar el span con la clase active y quitarsela
  let oldTarget = document.querySelector('#addTaskContainer span.taskDifActive');
  oldTarget.classList.remove('taskDifActive');
  //agregar la clase taskDifActive al target seleccionado 
  e.target.className += ' taskDifActive';
}

function getPriority(){
  let priority = document.querySelector('.taskDifActive').innerHTML;
  priority = changePriorityToNumber(priority)
  return priority;
}

// most used function
function makeRequest(method, route, data, successFunction) {
  $.ajax({
    type: method,
    dataType: "json",
    url: window.location.href + route,
    data: data, // TODO
    success: (reply) => {
      console.log(reply);
      let body = JSON.parse(reply.dataResponse.body);
      if (body.success == true) {
        changeSync('ok');
        if(successFunction) { // a veces no necesitas nada mas (como cuando se elimina la tarea)
          let data = body.data;
          successFunction(data);
        }
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
}

// called by makeRequest when succesfully added a new Task
function sucessAddTask(data){ 
  let priorityTask = convertPriorityToText(data.priority);
  let notesReply;
  if (data.notes) 
    notesReply = `<p class="noteTask mb-0">${data.notes}</p>`;
  else
    notesReply = ``;
  
  //agregarlo a la vista
  let containerTasks = document.getElementById('containerTasks');
  let newElement = document.createElement('div');
  newElement.classList += 'row rowTask pt-2 pb-2'; // agregar las clases al elemento nuevo
  newElement.innerHTML = `
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
  `; // todo : onclick -> debería estar en js como eventListener y no en html
  containerTasks.insertBefore(newElement,containerTasks.firstChild);
}

