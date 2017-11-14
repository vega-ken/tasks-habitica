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