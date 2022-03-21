var game = null;
var endGame = false;
var currentEnergy = 3;
var velocity = 3;
var points = 0;
var saved = 0;
var lost = 0;

var enemy1X = null;
var enemy1Y = null;
var enemy2X = null;
var enemy2Y = null;

var timeExplosion = null;
var timeCollision4 = null;
var timeExplosion2 = null;
var timeFriend = null;
var timeExplosion3 = null;

var music = document.getElementById('musica');
var soundShoot = document.getElementById('somDisparo');
var soundExplosion = document.getElementById('somExplosao');
var soundGameOver = document.getElementById('somGameover');
var soundLost = document.getElementById('somPerdido');
var soundRescue = document.getElementById('somResgate');

$('#inicio').click(start);

function start() {
  $('#inicio').hide();

  $('#fundoGame').append("<div id='jogador' class='anima1'><div/>");
  $('#fundoGame').append("<div id='inimigo1' class='anima2'><div/>");
  $('#fundoGame').append("<div id='inimigo2'><div/>");
  $('#fundoGame').append("<div id='amigo' class='anima3'><div/>");
  $('#fundoGame').append("<div id='placar'></div>");
  $('#fundoGame').append("<div id='energia'></div>");

  game = {};
  endGame = false;
  currentEnergy = 3;
  velocity = 3;
  points = 0;
  saved = 0;
  lost = 0;

  let music = document.getElementById('musica');

  music.addEventListener(
    'ended',
    function () {
      music.currentTime = 0;
      music.play();
    },
    false
  );

  music.play();

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
    collisionGame();
    scoreboard();
    energy();
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
    soundShoot.play();
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

function collisionGame() {
  let collision1 = $('#jogador').collision($('#inimigo1'));
  let collision2 = $('#jogador').collision($('#inimigo2'));
  let collision3 = $('#disparo').collision($('#inimigo1'));
  let collision4 = $('#disparo').collision($('#inimigo2'));
  let collision5 = $('#jogador').collision($('#amigo'));
  let collision6 = $('#inimigo2').collision($('#amigo'));

  if (collision1.length > 0) {
    currentEnergy--;
    enemy1X = parseInt($('#inimigo1').css('left'));
    enemy1Y = parseInt($('#inimigo1').css('top'));
    explosion1(enemy1X, enemy1Y);

    posY = parseInt(Math.random() * 334);
    $('#inimigo1').css('left', 694);
    $('#inimigo1').css('top', posY);
  }

  if (collision2.length > 0) {
    currentEnergy--;
    enemy2X = parseInt($('#inimigo2').css('left'));
    enemy2Y = parseInt($('#inimigo2').css('top'));
    explosion2(enemy2X, enemy2Y);

    $('#inimigo2').remove();
    repositionEnemy2();
  }

  if (collision3.length > 0) {
    velocity = velocity + 0.3;
    points = points + 100;
    enemy1X = parseInt($('#inimigo1').css('left'));
    enemy1Y = parseInt($('#inimigo1').css('top'));
    explosion1(enemy1X, enemy1Y);

    $('#disparo').css('left', 950);
    posY = parseInt(Math.random() * 334);
    $('#inimigo1').css('left', 694);
    $('#inimigo1').css('top', posY);
  }

  if (collision4.length > 0) {
    points = points + 50;
    enemy2X = parseInt($('#inimigo2').css('left'));
    enemy2Y = parseInt($('#inimigo2').css('top'));
    $('#inimigo2').remove();

    explosion2(enemy2X, enemy2Y);
    $('#disparo').css('left', 950);
    repositionEnemy2();
  }

  if (collision5.length > 0) {
    saved++;
    soundRescue.play();
    repositionFriend();
    $('#amigo').remove();
  }

  if (collision6.length > 0) {
    lost++;
    friendX = parseInt($('#amigo').css('left'));
    friendY = parseInt($('#amigo').css('top'));

    explosion3(friendX, friendY);
    $('#amigo').remove();
    repositionFriend();
  }

  function explosion1(enemy1X, enemy1Y) {
    soundExplosion.play();
    $('#fundoGame').append("<div id='explosao1'></div");
    $('#explosao1').css(
      'background-image',
      'url(./assets/images/explosao.png)'
    );

    let div = $('#explosao1');
    div.css('top', enemy1Y);
    div.css('left', enemy1X);
    div.animate({ width: 200, opacity: 0 }, 'slow');

    timeExplosion = window.setInterval(removeExplosion, 1000);

    function removeExplosion() {
      div.remove();
      window.clearInterval(timeExplosion);
      timeExplosion = null;
    }
  }

  function repositionEnemy2() {
    timeCollision4 = window.setInterval(reposition4, 5000);

    function reposition4() {
      window.clearInterval(timeCollision4);
      timeCollision4 = null;

      if (endGame == false) {
        $('#fundoGame').append('<div id=inimigo2></div');
      }
    }
  }

  function explosion2(enemy2X, enemy2Y) {
    soundExplosion.play();
    $('#fundoGame').append("<div id='explosao2'></div");
    $('#explosao2').css(
      'background-image',
      'url(./assets/images/explosao.png)'
    );

    let div2 = $('#explosao2');
    div2.css('top', enemy2Y);
    div2.css('left', enemy2X);
    div2.animate({ width: 200, opacity: 0 }, 'slow');

    timeExplosion2 = window.setInterval(removeExplosion2, 1000);

    function removeExplosion2() {
      div2.remove();
      window.clearInterval(timeExplosion2);
      timeExplosion2 = null;
    }
  }

  function repositionFriend() {
    timeFriend = window.setInterval(reposition6, 6000);

    function reposition6() {
      window.clearInterval(timeFriend);
      timeFriend = null;

      if (endGame == false) {
        $('#fundoGame').append("<div id='amigo' class='anima3'></div>");
      }
    }
  }

  function explosion3(friendX, friendY) {
    soundLost.play();
    $('#fundoGame').append("<div id='explosao3' class='anima4'></div");
    $('#explosao3').css('top', friendY);
    $('#explosao3').css('left', friendX);

    timeExplosion3 = window.setInterval(resetExplosion3, 1000);

    function resetExplosion3() {
      $('#explosao3').remove();
      window.clearInterval(timeExplosion3);
      timeExplosion3 = null;
    }
  }
}
function scoreboard() {
  $('#placar').html(
    '<h2> Pontos: ' +
      points +
      ' Salvos: ' +
      saved +
      ' Perdidos: ' +
      lost +
      '</h2>'
  );
}

function energy() {
  if (currentEnergy == 3) {
    $('#energia').css('background-image', 'url(./assets/images/energia3.png)');
  }

  if (currentEnergy == 2) {
    $('#energia').css('background-image', 'url(./assets/images/energia2.png)');
  }

  if (currentEnergy == 1) {
    $('#energia').css('background-image', 'url(./assets/images/energia1.png)');
  }

  if (currentEnergy == 0) {
    $('#energia').css('background-image', 'url(./assets/images/energia0.png)');
    gameOver();
  }
}

function gameOver() {
  endGame = true;
  music.pause();
  soundGameOver.play();
  window.clearInterval(game.timer);
  window.clearInterval(timeShoot);
  window.clearInterval(timeExplosion);
  window.clearInterval(timeCollision4);
  window.clearInterval(timeExplosion2);
  window.clearInterval(timeFriend);
  window.clearInterval(timeExplosion3);
  game.timer = null;

  $('#jogador').remove();
  $('#inimigo1').remove();
  $('#inimigo2').remove();
  $('#amigo').remove();
  $('#fundoGame').append("<div id='fim'></div>");
  $('#fim').html(
    '<h1> Game Over </h1><p>Sua pontuação foi: ' +
      points +
      '</p>' +
      "<div id='reinicia'><h3>Jogar Novamente</h3></div>"
  );

  $('#reinicia').click(restartGame);
}

function restartGame() {
  soundGameOver.pause();
  $('#fim').remove();
  start();
}
