# Tasks-habitica
A node.js web app that works as an alternative task-manager for Habitica. For now, it just supports To-Dos.

<!-- ![demonstration gif](https://i.imgur.com/vCmbmwm.gifv "demonstration gif") -->
<!-- <a href="https://imgur.com/vCmbmwm"><img src="https://i.imgur.com/vCmbmwm.gif" title="source: imgur.com" align="center" /></a> -->

<!-- It uses the [Habitica API v3](https://habitica.com/apidoc/), HTML, CSS, JS and Bootstrap. -->

### Features

* Shows all your actual To-Dos in Habitica.
* Creation of To-Dos and their respective checklists (for now, the default difficulty when creating them is medium).
* Checking To-Dos and their respective checklists.
* Deletion of To-Dos.
* You can order the To-Dos, but this order won't sync with Habitica (working on it).
* New : you can now enter notes to the To-Dos with '|'. Example: "" Name of the To-Do | Notes for the To-Do ""

## Getting Started

### Prerequisites

* Having [Node.js](https://nodejs.org/) installed on your machine.
<!-- * Having <a href="https://nodejs.org/" target="_blank">Node.js</a> installed on your machine. -->
* Having an [Habitica](https://habitica.com/) account.

### Installing

Before running the program, you need to change the archive userApiKeys.js that is in the config folder.

Just replace *your-api-user-id* and *your-api-token* with yours from your account (you can get them [here](https://habitica.com/user/settings/api) ).

After you save your changes, open the terminal or command prompt in the path of the archives downloaded and type:

```
npm install
```

then

```
npm start
```

If everything is ok, go to your browser to http://localhost:3000 , it should show all your actual To-Dos if any.

After using the program, press Ctrl+C on the terminal to stop it.

## Troubleshooting

* To-Dos are completed or checked double clicking them on the text.

* If the command *npm start* gives you an error, you could have some service actually listening at port 3000. Check if port 3000 is listening on your machine.

## Ideas for next versions

- [ ] Enable Dailies and Habits (those will be added to the navbar as links).
- [x] Add notes to To-Dos with a character (example : " to-do name | to-do notes ")
- [x] Enable edit button.
- [ ] Enable the navigation button sync the order with Habitica' server.
- [x] Add an indicator for the synchronization with Habitica' server.
- [ ] Enable the user to choose difficulty of new To-Dos.

### Additional

In the case you want it, you can run this program in your android phone thanks to [Termux](https://play.google.com/store/apps/details?id=com.termux&hl=es_419). Just take the same steps and don't forget to add your API credentials.

## Author

* [Ken Vega](http://www.kenvega.com)

## Acknowledgments

* Thanks to [Brad](https://www.youtube.com/user/TechGuyWeb) and [Shaun](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg). Their youtube channels have helped me a lot.