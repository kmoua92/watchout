// start slingin' some d3 here.

var asteroidTween = function(endData) {
  asteroid = d3.select(this);
  var startPos = { x: parseFloat(asteroid.attr('cx')), y: parseFloat(asteroid.attr('cy')) };
  var endPos = { x: endData.x, y: endData.y };
  return function(t) {
    if (collide()) {
      if (score.currentscore > score.highscore) {
        score.highscore = score.currentscore;
        $('#high-score').text(score.currentscore);
      }
      score.currentscore = 0;
    }
    asteroid.attr('cx', startPos.x + (endPos.x - startPos.x) * t);
    asteroid.attr('cy', startPos.y + (endPos.y - startPos.y) * t);
  };
};



var randomLoc = function() {
  return { y: Math.max(40, Math.floor(Math.random() * ($('.board')[0].clientHeight - 20))), 
           x: Math.max(40, Math.floor(Math.random() * ($('.board')[0].clientWidth - 20)))};
};

var asteroids;

var createAsteroids = function(num) {
  asteroids = [];
  for (var i = 0; i < num; i++) {
    var loc = randomLoc();
    asteroids.push({x: loc.x, y: loc.y, direction: 50, key: i});
  }
};

setInterval(function() {
  createAsteroids(15);
  update(asteroids);
}, 1000);



createAsteroids(15);

d3.select('svg').selectAll('circle')
  .data(asteroids, function(d) { return d.key; })
  .enter().append('circle')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', 20)
  .attr('filter', 'url(#this_image)');

var update = function(asteroids) {
  var selection = d3.select('svg').selectAll('circle');
  selection.data(asteroids, function(d) { return d.key; })
    .transition().duration(750)
    .tween('custom', asteroidTween)
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 20)
    .attr('filter', 'url(#this_image)');

  selection.data(asteroids)
    .exit().remove();
};

// draggable player circle
d3.select('rect').call(d3.drag().on('drag', function() { 
  d3.select(this).attr('x', Math.min(450, Math.max(10, d3.event.x))); 
  d3.select(this).attr('y', Math.min(450, Math.max(10, d3.event.y)));   
}));


var collide = function() {
  var player = d3.select('rect');
  var playerLeft = parseFloat(player.attr('x'));
  var playerRight = playerLeft + parseFloat(player.attr('width'));
  var playerTop = parseFloat(player.attr('y'));
  var playerBottom = playerTop + parseFloat(player.attr('height'));

  var asteroids = d3.selectAll('circle').nodes();

  for (var i = 0; i < asteroids.length; i++) {
    var asteroidLeft = parseInt($(asteroids[i]).attr('cx')); 
    var asteroidRight = asteroidLeft + 40;
    var asteroidTop = parseInt($(asteroids[i]).attr('cy'));
    var asteroidBottom = asteroidTop + 40;

    var yCollision = (asteroidTop < playerBottom) && (asteroidBottom > playerTop);
    var xCollision = (asteroidLeft < playerRight) && (asteroidRight > playerLeft);
    // console.log(playerBottom, playerTop);
    if (yCollision && xCollision) {
      return true;
    } 
  };
  return false;
};

var score = {highscore: 0, currentscore: 0, collisions: 0};

// set interval every 50ms
setInterval(function() { 
  score.currentscore = score.currentscore + 1;
  $('#current-score').text(score.currentscore);
}, 50);










