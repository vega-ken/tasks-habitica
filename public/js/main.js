$("document").ready(() => {
  //PRESIONA ENTER EN ENTRADA
  $("#formAddTask").on('submit', (e) => {
    e.preventDefault();
    changeSync('waiting');
    let textNewTask = $("#textNewTask").val();
    let indexNoteTask = textNewTask.indexOf('|');

    let result = gettingTaskSliced(textNewTask, indexNoteTask);
    let nameNewTask = result.nameNewTask;
    let nameNoteTask = result.nameNoteTask;

    $.ajax({
      type: 'POST',
      dataType: "json",
      url: window.location.href + "addTask",  // toma el url actual y le agrega "addTask" : ejm de como queda :  http://localhost:3000/addTask
      data: { nameNewTask: nameNewTask, nameNoteTask: nameNoteTask, priority: 1.5 }, // TODO
      success: (reply) => {
        console.log(reply);
        let body = JSON.parse(reply.dataResponse.body);
        if (body.success == true) {
          changeSync('ok');
          let data = body.data;

          let priorityTask = convertPriorityToText(data.priority);
          let notesReply = checkIfNotes(data.notes);
          //agregarlo a la vista
          $("#containerTasks").prepend(`
          <div class="row rowTask pt-2 pb-2">
            <div class="col-8 col-xs-8 col-sm-8 col-md-8 col-lg-8">        
              <p class="taskName mb-0" id="${data.id}" ondblclick="checkTheTask(id)">${data.text} </p><p class="taskDif task${priorityTask} mb-2">${priorityTask}</p> 
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
          `);
        }
        else {
          changeSync('error');
        }
      }
    });
    $("#textNewTask").val('');
  })

  function checkTheTask(id) {
    changeSync('waiting');
    console.log(id);
    $("#" + id).parent().parent().remove(); // remover la fila entera de esa tarea
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: window.location.href + "checkTask",
      data: { idTask: id },
      success: (reply) => {
        //console.log(reply);
        let body = JSON.parse(reply.dataResponse.body);
        if (body.success == true) {
          changeSync('ok');
          let data = body.data;
          console.log(`HP : ${data.hp}, MP : ${data.hp}, XP : ${data.exp}, LVL : ${data.lvl}, GP : ${data.gp}`);
        }
        else {
          changeSync('error');
        }
      }
    });
  }
});



function changeSync(state) {
  if (state == 'waiting') {
    //cambiar clase a waiting. fa fa-2x fa-refresh fa-spin ml-auto . syncIcon
    $("#syncIcon").removeClass();
    $("#syncIcon").addClass("fa fa-2x fa-refresh fa-spin ml-auto");

  }
  else if (state == 'ok') {
    //cambiar clase a original. fa fa-2x fa-check-circle-o ml-auto
    $("#syncIcon").removeClass();
    $("#syncIcon").addClass("fa fa-2x fa-check-circle-o ml-auto");
  }
  else {
    //cambiar clase a error
    $("#syncIcon").removeClass();
    $("#syncIcon").addClass("fa fa-2x fa-exclamation-circle ml-auto");
  }
}

function gettingTaskSliced(textNewTask, indexNoteTask) {

  let nameNewTask;
  let nameNoteTask;

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

function convertPriorityToText(priorityNumber) {
  if (priorityNumber == 2) {
    return "Hard";
  }
  if (priorityNumber == 1.5) {
    return "Medium";
  }
  if (priorityNumber == 1) {
    return "Easy";
  }
  else {
    return "Trivial";
  }
}

function checkIfNotes(dataNotes) {
  if (dataNotes) {
    return `<p class="noteTask mb-0">${dataNotes}</p>`;
  }
  else {
    return ``;
  }
}

function deleteTask(id) {
  changeSync('waiting');
  $("#" + id).parent().parent().remove();
  $.ajax(
    {
      type: 'POST',
      dataType: "json",
      url: window.location.href + "deleteTask",
      data: { id: id },
      success:
      (reply) => {
        let body = JSON.parse(reply.dataResponse.body);
        if (body.success == true) {
          changeSync('ok');
        }
        else{
          changeSync('error');
        }
      }
    });
}

function editTask(id) {
  console.log('edit : ' + id);
  let textTask = $("#" + id).html();
  let noteTask = $("#" + id).siblings().filter('.noteTask')[0].innerHTML;  // el elemento hermano que tiene la clase de noteTask
 
  let element = $("#" + id).parent(); // donde esta el texto, las notas y las subtareas
  
  element.empty(); // falta preocuparse por las tareas que tienen subtareas
  element.append(`
    <form class="formEditTask"> 
      <input type="text" autocomplete="off" value="${textTask}" class="inputEditText ${id}" required>
      <input type="text" autocomplete="off" value="${noteTask}" class="inputEditNotes ${id}">
      <input type="hidden" class="idTaskTarget" value="${id}">
      <button class="editButton" type="submit"></button>
    </form>
  `);
}

// SUBMITING THE CHANGES TO THE HABITICA SERVER
$("body").on('submit', '.formEditTask' , (e) => {
  e.preventDefault();
  changeSync('waiting');
  let id = e.currentTarget.getElementsByClassName('idTaskTarget')[0].defaultValue;
  let nameTask = $(`.inputEditText.${id}`).val(); // document.getElementById('2345').value; //= $('#formEditTask').filter('inputEditText'); //e.currentTarget.getElementsByClassName('inputEditText');
  let noteTask = $(`.inputEditNotes.${id}`).val(); 

  $("#formEditTask").empty();
  
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: window.location.href + "updateTask",
    data: { id: id , nameTask : nameTask , noteTask : noteTask },
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
    error : (reply) => {
      console.log(reply);
      changeSync('error');
    }

    
  });
  
  
  
});