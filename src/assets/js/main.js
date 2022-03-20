$('#inicio').click(start);

function start() {
  $('#inicio').hide();

  $('#fundoGame').append("<div id='jogador' class='anima1'><div/>");
  $('#fundoGame').append("<div id='inimigo1' class='anima2'><div/>");
  $('#fundoGame').append("<div id='inimigo2'><div/>");
  $('#fundoGame').append("<div id='amigo' class='anima3'><div/>");

  let game = {};

  game.timer = setInterval(() => {
    moveBackground();
  }, 30);
}

function moveBackground() {
  let left = parseInt($('#fundoGame').css('background-position'));
  $('#fundoGame').css('background-position', left - 1);
}
