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

function classPriorityTask(priorityText){
  if (priorityText == "Hard") return "hard";
  else if (priorityText == "Medium") return "medium";
  else if (priorityText == "Easy") return "easy";
  else return "trivial";
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
  let oldTarget = document.querySelector('#addTaskContainer span.task-difficulty--active');
  oldTarget.classList.remove('task-difficulty--active');
  //agregar la clase task-difficulty--active al target seleccionado 
  e.target.className += ' task-difficulty--active';
}

function getPriority(){
  let priority = document.querySelector('.task-difficulty--active').innerHTML;
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
  let priorityTaskClass = classPriorityTask(priorityTask);
  
  //agregarlo a la vista
  let containerTasks = document.getElementById('containerTasks');
  let newElement = document.createElement('div');
  newElement.classList += 'row row-task pt-2 pb-2'; // agregar las clases al elemento nuevo
  newElement.innerHTML = `
    <div class="col-8 col-xs-8 col-sm-8 col-md-8 col-lg-8">
      <div id="rowTask-${data.id}">        
        <p class="row-task__task-name" id="taskNameId-${data.id}">${data.text}</p>
        <p class="task-difficulty task-difficulty--${priorityTaskClass}">${priorityTask}</p> 
        <p class="row-task__note-task mb-0">${data.notes}</p>
      </div>
      <div id="checklist-${data.id}">
      </div>
    </div>

    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
        <i id="addSubTaskId-${data.id}" class='fa fa-plus action-buttons addSubTaskId'></i>
      </div>
    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
      <i id="editTaskId-${data.id}" class='fa fa-pencil-square-o action-buttons editTaskId'></i>
    </div>
    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
      <i id="deleteTaskId-${data.id}" class='fa fa-trash action-buttons deleteTaskId'></i>
    </div>
    <div class="col-1 col-xs-1 col-sm-1 col-md-1 col-lg-1 text-center">
      <i class='fa fa-arrows-v action-buttons'></i>
    </div>
  `;
  containerTasks.insertBefore(newElement,containerTasks.firstChild);
}

// called by makeRequest when succesfully checked a task
function successCheckTask(data) {
  console.log(`HP : ${data.hp}, MP : ${data.mp}, XP : ${data.exp}, LVL : ${data.lvl}, GP : ${data.gp}`);
  let result = document.getElementById('statsText');
  result.innerHTML = `<i class="fa fa-heart footer__icon" aria-hidden="true"></i> : ${Math.round(data.hp)} &nbsp; <i class="fa fa-flask footer__icon" aria-hidden="true"></i> : ${Math.round(data.mp)} &nbsp; <i class="fa fa-database footer__icon" aria-hidden="true"></i> : ${Math.round(data.gp * 100) / 100}`;
}

function successAddSubTask(data){
  console.log('una subtarea fue agregada correctamente');
  console.log(data);

  //borrar el form anterior (es el ultimo elemento del div)
  $(`#checklist-${data.id}`).children().last().remove();

  //sacar la info del nuevo checkbox a poner (id y texto) de la variable data que llega
  let checklistSubTasks = data.checklist;
  let textNewSubTask = checklistSubTasks[checklistSubTasks.length-1].text;
  let idNewSubTask = checklistSubTasks[checklistSubTasks.length-1].id;

  //poner el checkbox con la informacion nueva
  $(`#checklist-${data.id}`).append(`
    <div class="checkbox ml-2">
      <input id="checkboxId-${idNewSubTask}" type="checkbox" class="subtask__checkbox-input"> 
      <label for="checkboxId-${idNewSubTask}" class="subtask__checkbox-label">
        <span class="subtask__checkbox-button"></span>
        ${textNewSubTask}
      </label>
    </div>
  `);
}

function successUpdateTask(data){
  let priorityTask = convertPriorityToText(data.priority);
  let priorityTaskClass = classPriorityTask(priorityTask);
 
  // borrar el form y reemplazarlos en la fila
  $(`#formEditTask-${data.id}`).remove();
  $(`#rowTask-${data.id}`).prepend(`
    <div id="rowTask-${data.id}">        
      <p class="row-task__task-name" id="taskNameId-${data.id}">${data.text}</p>
      <p class="task-difficulty task-difficulty--${priorityTaskClass}">${priorityTask}</p> 
      <p class="row-task__note-task mb-0">${data.notes}</p>
    </div>
  `);
}