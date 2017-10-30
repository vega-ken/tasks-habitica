const express = require('express');
const router = express.Router();
const requestify = require('requestify');

const keys = require('../config/keys');


// RUTA INICIAL
router.get('/', (req, res) => {
  requestify.request('https://habitica.com/api/v3/tasks/user?type=todos', {
    method: 'GET',
    headers: {
      'x-api-user': keys.apiUser,
      'x-api-key': keys.apiKey
    }
  })
    .then((response) => {
      //console.log("hay respuesta por habitica");
      respuestaPrincipal = response.getBody();
      //console.log(respuestaPrincipal['data']);
      res.render('index', {
        data: respuestaPrincipal['data']
      });
    });
});

// MARCAR UNA TAREA COMO HECHA
router.post('/checkTask', (req, res) => {
  let id = req.body.id;
  let checkTaskString = "https://habitica.com/api/v3/tasks/" + id + "/score/up";
  //console.log(checkTaskString);
  requestify.request(checkTaskString, {
    method: 'POST',
    headers: {
      'x-api-user': keys.apiUser,
      'x-api-key': keys.apiKey
    }
  })
    .then((response) => {
      //console.log(`respuesta : ${response}`);
      res.json({ dataResponse: response }).end();
    });
});

//AGREGAR UNA TAREA
router.post('/addTask', (req, res) => {
  let nameNewTask = req.body.nameNewTask;
  let nameNoteTask = req.body.nameNoteTask;
  let priority = req.body.priority;

  requestify.request('https://habitica.com/api/v3/tasks/user', {
    method: 'POST',
    body: {
      text: nameNewTask,
      notes: nameNoteTask,
      type: 'todo',
      priority: priority
    },
    headers: {
      'x-api-user': keys.apiUser,
      'x-api-key': keys.apiKey
    }
  })
    .then((response) => {
      //console.log(`respuesta : ${response}`);
      res.json({ dataResponse: response }).end();
    });
});

// BORRAR UNA TAREA
router.post('/deleteTask', (req, res) => {
  let id = req.body.id;
  let stringURL = `https://habitica.com/api/v3/tasks/${id}`;

  requestify.request(stringURL, {
    method: 'DELETE',
    headers: {
      'x-api-user': keys.apiUser,
      'x-api-key': keys.apiKey
    }
  })
    .then((response) => {
      res.json({ dataResponse: response }).end();
    });
});

//ACTUALIZAR UNA TAREA (solo titulo y notas)
router.post('/updateTask', (req, res) => {
  let id = req.body.id;
  let nameTask = req.body.nameTask;
  let noteTask = req.body.noteTask;

  let stringURL = `https://habitica.com/api/v3/tasks/${id}`;

  requestify.request(stringURL, {
    method: 'PUT',
    body: {
      text: nameTask,
      notes: noteTask,
      //priority: priority
    },
    headers: {
      'x-api-user': keys.apiUser,
      'x-api-key': keys.apiKey
    }
  })
    .then((response) => {
      res.json({ dataResponse: response }).end();
    });

})

module.exports = router;