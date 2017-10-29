module.exports = {
  dificultad: function(numero) {
    if(numero == 2){
      return "Hard";
    }
    if(numero == 1.5){
      return "Medium";
    }
    if(numero == 1){
      return "Easy";
    }
    else{
      return "Trivial";
    }
  }
}

