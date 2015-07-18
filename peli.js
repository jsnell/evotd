var cellsize = 40;
var halfcell = cellsize / 2;
var rows = 12;
var cols = 20;

function Plan(game) {
    this.game = game
    this.commands = [];
    this.index = 0;

    this.addCommand = function(command) {
        var fun = this.parse(command);
        this.commands.push({ command: command,
                             fun: fun,
                             done: false,
                             skipped: false });
    };

    this.parse = function(command) {
        var tokens = command.split(/\s+/);
        var cmd = tokens.shift();
        if (cmd == 'build') {
            var typestr = tokens.shift();
            var type;
            switch (typestr) {
            case 'gun':
                type = GunTower;
                break;
            case 'pulse':
                type = PulseTower;
                break;
            };
            var c = parseInt(tokens.shift());
            var r = parseInt(tokens.shift());
            return function(game) { return game.addTower(c, r, type); }
        }
        throw "Unknown command " + cmd;
    };
    
    this.maybeExecuteNext = function() {
        if (this.index >= this.commands.length) {
            return;
        }
        try {
            if (!this.commands[this.index].fun(this.game)) {
                return false;
            }
            this.commands[this.index].done = true;
        } catch (e) {            
            this.commands[this.index].skipped = true;
            console.log(e);
        }
        this.index++;
        return true;
    };

    this.draw = function() {
        var elem = $('#plan');
        elem.text('');
        var currentIndex = this.index;
        _(this.commands).each(function (command, index) {
            var style = 'cmd';
            if (command.done) {
                style = 'cmd-done';
            } else if (command.skipped) {
                style = 'cmd-skipped';
            } else if (index == currentIndex) {
                style = 'cmd-current'; 
           }
            elem.append('<li class=' + style + '> ' + command.command);
        });
    };
    
    return this;
}

function Game() {
    this.plan = new Plan(this);
    this.monsters = _([]);
    this.towers = _([]);
    this.spawnPoints = _([]);
    this.bullets = _([]);
    this.tiles = {};
    this.monsterDeaths = 0;
    this.monsterWins = 0;
    this.money = 10;
    this.callback = null;
    this.tryExecute = true;

    for (var r = 0; r < rows; r++) {
        this.tiles[r] = {};
        for (var c = 0; c < cols; c++) {
            this.tiles[r][c] = 0;
        }
    }

    this.start = function(callback, interval) {
        if (callback) {
            this.callback = callback;
        }
        if (this.timer) {
            this.pause();
        }
        this.timer = setInterval(this.callback, 50);
    };

    this.pause = function() {
        clearInterval(this.timer);
        this.timer = null;
    };
    
    this.update = function() {
        var game = this;
        if (this.tryExecute) {
            // Commands exexuted as side effect of condition.
            while (this.plan.maybeExecuteNext()) {
                this.tryExecute = false;
            }
        }
        this.monsters = _(this.monsters.filter(function (monster) {
            updateMonster(monster, game);
            return !(monster.win || monster.dead);
        }));
        this.towers.each(function (tower) {
            tower.update(game);
        });
        this.spawnPoints.each(function (sp) {
            updateSpawnPoint(sp, game);
        });
    };

    this.draw = function (canvas, ctx) {
        this.plan.draw();
        drawMap(canvas, ctx);
        this.monsters.each(function (monster) {
            drawMonster(canvas, ctx, monster);
        });
        this.towers.each(function (tower) {
            tower.draw(canvas, ctx);
        });
    };

    this.addTower = function(c, r, klass) {
        if (this.tiles[r][c] != 0) {
            throw "Tile " + r + " " + c + " blocked";
        }
        var tower = new klass(column(c), row(r));
        if (tower.cost > this.money) {
            return false;
        }
        this.tiles[r][c] = tower.background;
        try {
            this.spawnPoints.each(function (sp) {
                sp.recomputePath();
            });
        } catch (e) {
            // Undo blocking this tile
            this.tiles[r][c] = 0;
            // Redo the paths
            this.spawnPoints.each(function (sp) {
                sp.recomputePath();
            });
            throw e;
        }
        this.money -= tower.cost;
        this.towers.push(tower);

        return true;   
    }

    this.addSpawnPoint = function(c, r, goal) {
        var sp = new SpawnPoint(this, c, r, goal);
        this.spawnPoints.push(sp);
        this.tiles[r][c] = 3;
        this.tiles[goal[1]][goal[0]] = 2;
        sp.recomputePath();
        return sp;
    };

    this.monsterWin = function(monster) {
        monster.win = true;
        this.monsterWins++;
        this.updateStatus();
    };

    this.monsterDead = function(monster) {
        if (monster.dead) {
            return;
        }
        monster.dead = true;
        this.monsterDeaths++;
        this.money += monster.reward;
        this.updateStatus();
        this.tryExecute = true;
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
            if (tile >= 10) {
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

    this.damage = function(game, damage) {      
        this.hp -= damage;
        if (this.hp < 0) {
            game.monsterDead(this);
        }
    };

    return this;
}

function GunTower(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.background = 10;
    this.range = cellsize * 1.75;
    this.cost = 5;

    this.update = function(game) {
        var tower = this;
        if (tower.shootAnimation) {
            tower.shootAnimation -= 0.5;
            if (tower.shootAnimation < 0) {
                tower.shootAnimation = 0;
            }
        } else {
            var target = null;
            var angle;
            if (tower.target && distance(tower, tower.target) < this.range) {
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
                    if (d < this.range) {
                        tower.cooldown = 20;
                        tower.shootAnimation = 5;
                        tower.shootingAt = {
                            x: target.x,
                            y: target.y,
                        };
                        target.damage(game, 15);
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

    this.draw = function(canvas, ctx) {
        var tower = this;
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
    
    return this;
}

function PulseTower(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.shootAnimation = 0;
    this.idleAnimation = 0;
    this.background = 11;
    this.range = cellsize * 2;
    this.cost = 80;

    this.update = function(game) {
        var tower = this;
        tower.angle = normalizeAngle(tower.angle + 0.3);    
        if (tower.shootAnimation) {
            tower.shootAnimation -= 1;
            if (tower.shootAnimation == 1) {
                game.monsters.each(function (monster) {
                    var d = distance(tower, monster);
                    if (d <= tower.range) {
                        monster.damage(game, 100);
                    }
                });
            }
            return;
        }
        if (tower.cooldown) {
            tower.cooldown -= 1;
            return;
        }

        var target = findClosest(tower, game.monsters);
        if (target && distance(tower, target) < tower.range) {
            tower.shootAnimation = 5;
            tower.cooldown = 20;
            tower.idleAnimation = 0;
        } else {
            if (!tower.idleAnimation) {
                tower.idleAnimation = 10;
            } else {
                tower.idleAnimation -= 1;
            }
        }
    }

    this.draw = function(canvas, ctx) {
        var tower = this;
        ctx.save();
        ctx.translate(tower.x, tower.y);

        ctx.beginPath();
        ctx.rotate(tower.angle);
        ctx.arc(0, 0, halfcell * 0.9, 0, 2*Math.PI);
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, halfcell * 0.5, 0, 2*Math.PI);
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        ctx.fill();

        ctx.save();
        for (var i = 0; i < 3; ++i) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, halfcell * 0.75);
            ctx.rotate(Math.PI * 2 / 3);
            ctx.lineWidth = 5;
            ctx.stroke();
        }
        ctx.restore();
        
        ctx.beginPath();
        
        if (tower.shootAnimation) {
            var r = cellsize +
                (tower.range - cellsize) * (5 - tower.shootAnimation) / 5;
            ctx.arc(0, 0, r, 0, 2*Math.PI);
        } else if (tower.idleAnimation) {
            ctx.arc(0, 0, (halfcell - tower.idleAnimation) / 2, 0, 2*Math.PI);
        }

        ctx.strokeStyle = "steelblue";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }

    return this;
}

function drawMap(canvas, ctx) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var r = 0; r < rows; ++r) {
        for (var c = 0; c < cols; ++c) {
            var colors = { 0: "darkgreen",
                           2: "red",
                           3: "lightblue",
                           10: "yellow",
                           11: "lightgray"
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
    if (monster.dead) {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = "pink";
    }
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

function updateSpawnPoint(sp, game) {
    if (sp.cooldown) {
        sp.cooldown--;
    } else {
        sp.spawn();
        sp.cooldown = 20;
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

var game;
function init() {
    game = new Game();
    game.addSpawnPoint(0, 4, [19, 7]);
    game.addSpawnPoint(10, 0, [10, 11]);

    game.plan.addCommand('build gun 8 4');
    game.plan.addCommand('build pulse 8 4');
    game.plan.addCommand('build gun 10 5');
    game.plan.addCommand('build gun 5 6');
    game.plan.addCommand('build gun 7 7');
    game.plan.addCommand('build gun 7 8');
    game.plan.addCommand('build gun 10 6');
    game.plan.addCommand('build pulse 8 6');

    this.game.spawnPoints.each(function (x) {
        x.spawn();
    });

    $('#main').each(function (index, canvas) {
        if (!canvas.getContext) {
            return;
        }
        var ctx = canvas.getContext("2d");

        function updateAndDraw() {
            game.update();
            game.draw(canvas, ctx);
        };
        game.start(updateAndDraw, 50);
    });
}
