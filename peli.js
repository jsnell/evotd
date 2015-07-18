var cellsize = 40;
var halfcell = cellsize / 2;
var rows = 12;
var cols = 20;

function Game() {
    this.monsters = _([]);
    this.towers = _([]);
    this.spawnPoints = _([]);
    this.bullets = _([]);
    this.tiles = {};
    this.monsterDeaths = 0;
    this.monsterWins = 0;
    this.money = 10;

    for (var r = 0; r < rows; r++) {
        this.tiles[r] = {};
        for (var c = 0; c < cols; c++) {
            this.tiles[r][c] = 0;
        }
    }

    this.update = function() {
        var game = this;
        this.monsters = _(this.monsters.filter(function (monster) {
            updateMonster(monster, game);
            return !(monster.win || monster.dead);
        }));
        this.towers.each(function (tower) {
            updateTower(tower, game);
        });
    };

    this.draw = function (canvas, ctx) {
        drawMap(canvas, ctx);
        this.monsters.each(function (monster) {
            drawMonster(canvas, ctx, monster);
        });
        this.towers.each(function (tower) {
            drawTower(canvas, ctx, tower);
        });
    };

    this.addTower = function(c, r) {
        this.towers.push(new Tower(column(c), row(r)));
        this.tiles[r][c] = 1;
        this.spawnPoints.each(function (sp) {
            sp.recomputePath();
        });
    }

    this.addSpawnPoint = function(c, r, goal) {
        var sp = new SpawnPoint(this, c, r, goal);
        this.spawnPoints.push(sp);
        this.tiles[r][c] = 3;
        this.tiles[goal[1]][goal[0]] = 2;
        return sp;
    };

    this.monsterWin = function(monster) {
        monster.win = true;
        this.monsterWins++;
        this.updateStatus();
    };

    this.monsterDead = function(monster) {
        monster.dead = true;
        this.monsterDeaths++;
        this.money += monster.reward;
        this.updateStatus();        
    };

    this.updateStatus = function () {
        var text = this.monsterDeaths + " / " + this.monsterWins + " / " +
            "$" + this.money;
        $('#status').each(function(index, elem) {
            elem.innerText = text;
        });
    };
}

function SpawnPoint(game, c, r, goal) {
    this.game = game;
    this.c = c;
    this.r = r;
    this.x = column(c);
    this.y = row(r);
    this.goal = goal;

    this.spawn = function() {
        this.game.monsters.push(new Monster(this.x, this.y, this.path));
    }

    this.recomputePath = function() {
        var visited = {};
        var queued = [];
        function visit(r, c, n) {
            var x = r + rows * c;
            queue(r + 1, c, n);
            queue(r - 1, c, n);
            queue(r, c + 1, n);
            queue(r, c - 1, n);
        };
        var result = [];
        function unroll(r, c, n) {
            var x = r + rows * c;
            if (visited[x] != n) {
                return false;
            }
            result.push([column(c), row(r)]);
            unroll(r - 1, c, n - 1) ||
                unroll(r + 1, c, n - 1) ||
                unroll(r, c - 1, n - 1) ||
                unroll(r, c + 1, n - 1);
            return true;
        }
        var goalc = this.goal[0];
        var goalr = this.goal[1];
        function queue(r, c, n) {
            if (r < 0 || c < 0 || r >= rows || c >= cols) {
                return;
            }
            var tile = this.game.tiles[r][c];
            if (tile == 1) {
                return;
            }
            var x = r + rows * c;
            if (visited[x]) {
                return;
            }
            visited[x] = n;
            if (r == goalr && c == goalc) {
                unroll(r, c, n);
                queued = [];
                return;
            }
            queued.push([r, c, n + 1]);
        }
        queue(this.r, this.c, 1);
        while (queued.length) {
            var cell = queued.shift();
            visit(cell[0], cell[1], cell[2]);
        }
        this.path = result.reverse();
    }
}

function Monster(x, y, path) {
    this.x = x;
    this.y = y;
    this.speed = 2.5 + Math.random() * 5;
    this.path = path;
    this.pathIndex = 0;
    this.hp = this.maxHp = 50;
    this.reward = 1;
    return this;
}

function Tower(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    return this;
}

function drawMap(canvas, ctx) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var r = 0; r < rows; ++r) {
        for (var c = 0; c < cols; ++c) {
            var colors = { 0: "darkgreen",
                           1: "yellow",
                           2: "red",
                           3: "lightblue"
                         }
            ctx.fillStyle=colors[game.tiles[r][c]];
            ctx.fillRect(c * cellsize - halfcell, r * cellsize - halfcell,
                         cellsize, cellsize);
        }
    }

    ctx.restore();
}

function drawMonster(canvas, ctx, monster) {
    ctx.save();

    ctx.beginPath();
    ctx.translate(monster.x, monster.y);
    ctx.arc(0, 0, halfcell * 0.9 - 2, 0, 2*Math.PI);
    ctx.fillStyle = "pink";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Plot pathfinding state.
    // ctx.save();
    // _(monster.path).each(function(cell) {
    //     var x = cell[0];
    //     var y = cell[1];
    //     ctx.lineTo(x, y);
    // });
    // ctx.strokeStyle = "yellow";
    // ctx.stroke();
    // ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.translate(monster.x - halfcell, monster.y + halfcell);
    ctx.moveTo(0, 0);
    ctx.lineTo(cellsize * (monster.hp / monster.maxHp), 0);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.restore();
}

function clamp(value, min, max) {
    if (value < min) { return min }
    if (value > max) { return max }
    return value;
}

function updateMonster(monster, game) {
    if (monster.pathIndex == monster.path.length) {
        game.monsterWin(monster);
        return;
    }

    var target = monster.path[monster.pathIndex];
    var speed = monster.speed;
    var xd = clamp(target[0] - monster.x, -speed, speed);
    var yd = clamp(target[1] - monster.y, -speed, speed);
    monster.x += xd;
    monster.y += yd;
    if (Math.floor(monster.x) == target[0] &&
        Math.floor(monster.y) == target[1]) {
        monster.pathIndex += 1;
    }
}

function drawTower(canvas, ctx, tower) {
    // ctx.save();
    // var x = tower.x - tower.x % 10 - 10;
    // var y = tower.y - tower.y % 10 - 10;
    // ctx.fillStyle="lightgreen";
    // ctx.fillRect(x, y, 20, 20);
    // ctx.restore();

    ctx.save();
    if (tower.shootAnimation) {
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y);
        ctx.lineTo(tower.shootingAt.x, tower.shootingAt.y);
        ctx.lineWidth = tower.shootAnimation;
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    ctx.restore();

    ctx.save();

    ctx.beginPath();
    ctx.translate(tower.x, tower.y);
    ctx.rotate(tower.angle);
    ctx.arc(0, 0, halfcell * 0.9, 0, 2*Math.PI);
    ctx.fillStyle = "darkgray";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, halfcell * 1.5);
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.restore();
}

function distance(a, b) {
    var xd = a.x - b.x;
    var yd = a.y - b.y;
    return Math.sqrt(xd * xd + yd * yd);
}

function findClosest(object, list) {
    var best = null;
    var best_d = null;
    list.each(function (other) {
        var d = distance(object, other);
        if (best == null || d < best_d) {
            best = other;
            best_d = d;
        }
    });

    return best;
}

function angleFrom(a, b) {
    return normalizeAngle(Math.atan2(a.x - b.x,
                                     b.y - a.y));
}

function normalizeAngle(angle) {
    var full = Math.PI * 2;
    while (angle < 0) {
        angle += full;
    }
    while (angle > full) {
        angle -= full;
    }
    return angle;
}

function updateTower(tower, game) {
    if (tower.shootAnimation) {
        tower.shootAnimation -= 0.5;
        if (tower.shootAnimation < 0) {
            tower.shootAnimation = 0;
        }
    } else {
        var target = null;
        var angle;
        if (tower.target && distance(tower, tower.target) < 40) {
            target = tower.target;
        } else {
            target = findClosest(tower, game.monsters);
        }
        if (target) {
            angle = angleFrom(tower, target);
        } else {
            angle = 0;
        }
        var diff = angle - tower.angle;
        var turnSpeed = 0.2;
        if (Math.abs(diff) < turnSpeed) {
            tower.angle = angle;
            if (!tower.cooldown && target) {
                var d = distance(tower, target);
                if (d < cellsize * 2.5) {
                    tower.cooldown = 20;
                    tower.shootAnimation = 5;
                    tower.shootingAt = {
                        x: target.x,
                        y: target.y,
                    };
                    target.hp -= 15;
                    if (target.hp < 0) {
                        game.monsterDead(target);
                    }
                }
            }
        } else {
            var direction = (normalizeAngle(diff) < Math.PI ?
                             turnSpeed : -turnSpeed);
            tower.angle = normalizeAngle(tower.angle + direction);
        }
    }

    tower.cooldown -= 1;
    if (tower.cooldown < 0) {
        tower.cooldown = 0;
    }
}

function as_row(x) {
    return Math.floor(x / cellsize);
}

function as_column(y) {
    return Math.floor(y / cellsize);
}

function row(r) {
    return r * cellsize;
}

function column(c) {
    return c * cellsize;
}

var game = new Game();
function init() {
    game.addSpawnPoint(0, 4, [19, 7]);
    game.addSpawnPoint(10, 0, [10, 11]);

    game.addTower(5, 3);
    game.addTower(4, 4);
    game.addTower(4, 5);
    game.addTower(5, 6);
    game.addTower(7, 7);
    game.addTower(7, 8);
    game.addTower(10, 6);

    this.game.spawnPoints.each(function (x) {
        x.spawn();
    });
    setInterval(function () {
        this.game.spawnPoints.each(function (x) {
            x.spawn();
        });
    }, 1000);

    $('#main').each(function (index, canvas) {
        if (!canvas.getContext) {
            return;
        }
        var ctx = canvas.getContext("2d");

        function updateAndDraw() {
            game.update();
            game.draw(canvas, ctx);
        };
        updateAndDraw();
        game.updateStatus();
        setInterval(updateAndDraw, 50);
    });
}
