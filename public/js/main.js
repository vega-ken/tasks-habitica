$("document").ready(() => {
  console.log('hello mundo');

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
      data: { nameNewTask: nameNewTask, nameNoteTask: nameNoteTask , priority : 1.5 },
      success: (reply) => {
        console.log(reply);
        let body = JSON.parse(reply.dataResponse.body);
        if (body.success == true) {
          changeSync('ok');
          let data = body.data;
          
        }
        else {
          changeSync('error');
        }
      }
    });

    $("#textNewTask").val('');


    console.log(nameNewTask);
    console.log(nameNoteTask);
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