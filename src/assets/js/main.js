$('#inicio').click(start);

function start() {
  $('#inicio').hide();

  $('#fundoGame').append("<div id='jogador' class='anima1'><div/>");
  $('#fundoGame').append("<div id='inimigo1' class='anima2'><div/>");
  $('#fundoGame').append("<div id='inimigo2'><div/>");
  $('#fundoGame').append("<div id='amigo' class='anima3'><div/>");

  let game = {};

  const keys = {
    W: 87,
    S: 83,
    D: 68,
  };

  game.keyPress = [];

  $(document).keydown(function (e) {
    game.keyPress[e.which] = true;
  });

  $(document).keyup(function (e) {
    game.keyPress[e.which] = false;
  });

  game.timer = setInterval(() => {
    moveBackground();
    movePlayer(game.keyPress, keys);
  }, 30);
}

function moveBackground() {
  let left = parseInt($('#fundoGame').css('background-position'));
  $('#fundoGame').css('background-position', left - 1);
}

function movePlayer(keyPress, keys) {
  let player = $('#jogador');
  let pos = parseInt(player.css('top'));

  if (keyPress[keys.W]) {
    player.css('top', pos - 10);
  }

  if (keyPress[keys.S]) {
    player.css('top', pos + 10);
  }

  if (keyPress[keys.D]) {
  }
}
