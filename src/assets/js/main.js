$('#inicio').click(start);

function start() {
  $('#inicio').hide();

  $('#fundoGame').append("<div id='jogador' class='anima1'><div/>");
  $('#fundoGame').append("<div id='inimigo1' class='anima2'><div/>");
  $('#fundoGame').append("<div id='inimigo2'><div/>");
  $('#fundoGame').append("<div id='amigo' class='anima3'><div/>");

  let game = {};

  const VELOCITY_ENEMY_1 = 5;
  const VELOCITY_ENEMY_2 = 3;
  const VELOCITY_FRIEND = 1;

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
    moveEnemy1(VELOCITY_ENEMY_1);
    moveEnemy2(VELOCITY_ENEMY_2);
    moveFriend(VELOCITY_FRIEND);
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

    if (pos <= 0) {
      player.css('top', pos + 10);
    }
  }

  if (keyPress[keys.S]) {
    player.css('top', pos + 10);

    if (pos >= 434) {
      player.css('top', pos - 10);
    }
  }

  if (keyPress[keys.D]) {
    shoot();
  }
}

function moveEnemy1(velocity) {
  let enemy = $('#inimigo1');
  let posX = parseInt(enemy.css('left'));
  let posY =
    parseInt(enemy.css('top')) > 0
      ? parseInt(enemy.css('top'))
      : parseInt(Math.random() * 334);

  enemy.css('left', posX - velocity);
  enemy.css('top', posY);

  if (posX <= 0) {
    posY = parseInt(Math.random() * 334);
    enemy.css('left', 694);
    enemy.css('top', posY);
  }
}

function moveEnemy2(velocity) {
  let enemy = $('#inimigo2');
  let posX = parseInt(enemy.css('left'));

  enemy.css('left', posX - velocity);

  if (posX <= 0) {
    enemy.css('left', 775);
  }
}

function moveFriend(velocity) {
  let friend = $('#amigo');
  let posX = parseInt(friend.css('left'));

  friend.css('left', posX + velocity);

  if (posX > 906) {
    friend.css('left', 0);
  }
}

let userCanShoot = true;
let timeShoot = null;

function shoot() {
  if (userCanShoot) {
    userCanShoot = false;

    let posTop = parseInt($('#jogador').css('top'));
    let posX = parseInt($('#jogador').css('left'));
    let shootX = posX + 190;
    let shootTop = posTop + 37;
    $('#fundoGame').append("<div id='disparo'><div/>");
    $('#disparo').css('top', shootTop);
    $('#disparo').css('left', shootX);

    timeShoot = setInterval(execShoot, 30);
  }

  function execShoot() {
    posX = parseInt($('#disparo').css('left'));
    $('#disparo').css('left', posX + 15);

    if (posX > 900) {
      window.clearInterval(timeShoot);
      timeShoot = null;
      $('#disparo').remove();
      userCanShoot = true;
    }
  }
}
