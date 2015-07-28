var cellsize = 40;
var halfcell = cellsize / 2;
var rows = 12;
var cols = 20;

var waves = [
    [ { source: 0, type: Flier, count: 3, interval: 100 } ],
    [ { source: 2, type: Flier, count: 3, interval: 100 } ],
    [ { source: 0, type: Walker, count: 3, interval: 100 } ],
    [ { source: 2, type: Walker, count: 3, interval: 100 } ],
    [ { source: 0, type: BigWalker, count: 2, interval: 200 } ],
    [ { source: 2, type: BigWalker, count: 2, interval: 200 } ],
    [ { source: 0, type: Tank, count: 1, interval: 100 } ],
    [ { source: 2, type: Tank, count: 1, interval: 100 } ],
    [ { source: 0, type: Speeder, count: 3, interval: 100 } ],
    [ { source: 2, type: Speeder, count: 3, interval: 100 } ],
];

function Plan(game) {
    this.game = game
    this.commands = [];
    this.index = 0;

    this.reset = function() {
        this.commands = [];
        this.index = 0;
    };

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
            case 'slow':
                type = SlowTower;
                break;
            case 'pulse':
                type = PulseTower;
                break;
            case 'missile':
                type = MissileTower;
                break;
            default:
                throw "Unknown tower type '" + type + "'";
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
    this.monsters = [];
    this.towers = [];
    this.spawnPoints = [];
    this.bullets = [];
    this.tiles = {};
    this.monsterDeaths = 0;
    this.hp = 20;
    this.money = 10;
    this.callback = null;
    this.waveIndex = 0;
    this.wave = null;
    this.gameOver = false;
    this.score = 0;

    for (var r = 0; r < rows; r++) {
        this.tiles[r] = {};
        for (var c = 0; c < cols; c++) {
            this.tiles[r][c] = 0;
        }
    }

    this.init = function(callback) {
        this.callback = callback;
    }

    this.start = function(interval) {
        if (this.gameOver) {
            return;
        }
        if (this.timer) {
            this.pause();
        }
        this.timer = setInterval(this.callback, interval);
        if (!this.wave) {
            this.newWave();
        }
    };

    this.pause = function() {
        clearInterval(this.timer);
        this.timer = null;
    };
    
    this.newWave = function() {
        do {
            this.updateStatus();
        } while (this.plan.maybeExecuteNext());
        this.score += this.waveIndex * 100;
        var wave = waves[this.waveIndex++ % waves.length];
        this.wave = wave;
        _(this.spawnPoints).each(function (sp, index) {
            console.assert(sp.state == 2);
            _(wave).each(function(wave_sp) {
                if (index == wave_sp.source) {
                    sp.newWave(wave_sp);
                }
            });
        });
    }

    this.update = function() {
        var game = this;
        if (this.gameOver) {
            this.pause();
        }
        this.monsters = _(this.monsters.filter(function (monster) {
            updateMonster(monster, game);
            return !(monster.win || monster.dead);
        }));
        _(this.towers).each(function (tower) {
            tower.update(game);
        });
        var wave_done = this.monsters.size() == 0;
        _(this.spawnPoints).each(function (sp, index) {
            if (sp.state != 2) {
                wave_done = false;
            }
            sp.update();
        });
        if (wave_done) {
            this.newWave();
        }
    };

    this.draw = function (canvas, ctx) {
        if (this.gameOver) {
            ctx.save();
            ctx.scale(canvas.width / 300,
                      canvas.height / 300);
            ctx.font = "40px Sans";
            ctx.lineWidth = 2;
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black";
            ctx.fillText("GAME OVER", 20, 33);
            ctx.strokeText("GAME OVER", 20, 33);
            ctx.restore();
            return;
        }
        this.plan.draw();
        drawMap(canvas, ctx);
        _(this.monsters).each(function (monster) {
            monster.draw(canvas, ctx);
        });
        _(this.towers).each(function (tower) {
            tower.draw(canvas, ctx);
        });
    };

    this.addTower = function(c, r, klass) {
        if (this.tiles[r][c] != 0) {
            throw "Tile " + r + " " + c + " blocked";
        }
        var tower = new klass(column(c), row(r));
        if (tower.cost > this.money) {
            if (!this.towers.length) {
                throw "Can never afford tower";
            }
            return false;
        }
        this.tiles[r][c] = tower.background;
        try {
            _(this.spawnPoints).each(function (sp) {
                sp.recomputePath();
            });
        } catch (e) {
            // Undo blocking this tile
            this.tiles[r][c] = 0;
            // Redo the paths
            _(this.spawnPoints).each(function (sp) {
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
        this.hp--;
        this.updateStatus();
        if (this.hp <= 0) {
            this.gameOver = true;
            if (this.onGameOver) {
                this.onGameOver();
            }
            this.pause();
        }
    };

    this.monsterDead = function(monster) {
        if (monster.dead) {
            return;
        }
        monster.dead = true;
        this.monsterDeaths++;
        this.money += monster.reward;
        this.score += this.waveIndex;
        this.updateStatus();
    };

    this.updateStatus = function () {
        var game = this;
        var text = "$" + this.money +
            ", health: " + this.hp +
            ", wave: " + this.waveIndex + 
            ", score: " + this.score;
        $('#status').each(function(index, elem) {
            elem.innerText = text;
            if (game.onStatus) {
                game.onStatus(elem);
            }
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
    // No wave set yet.
    this.state = 2;
    this.wave = null;
    this.cooldown = 0;
    this.generated = 0;

    this.newWave = function(wave) {
        this.state = 0;
        this.wave = wave;
        this.cooldown = wave.delay || 1;
        this.generated = 0;
    }
    
    this.update = function() {
        switch (this.state) {
        case 0:
            // Initial delay
            if (--this.cooldown < 0) {
                this.state = 1;
                // Don't reset cooldown.
            }
            break;
        case 1:
            // Generating
            if (--this.cooldown < 0) {
                var waveFactor = 1 + this.game.waveIndex / 20;
                this.game.monsters.push(new this.wave.type(this.x, this.y,
                                                           this.path,
                                                           waveFactor));
                if (++this.generated >= this.wave.count) {
                    this.state = 2;
                } else {
                    this.cooldown = this.wave.interval;
                }
            }
            break;
        case 2:
            // Done
            break;
        };
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
        if (result.length == 0) {
            throw "No path found";
        }
        this.path = result.reverse();
    }
}

function Monster(x, y, path) {
    this.x = x;
    this.y = y;
    this.path = path;
    this.pathIndex = 0;
    this.baseColor = "steelblue"
    this.slowColor = "lightblue"
    this.hitColor = "lightgray"
    this.deadColor = "read"

    this.damage = function(game, damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            game.monsterDead(this);
        }
        this.damageAnimation = 3;
    };

    this.draw = function(canvas, ctx) {
        try {
            ctx.save();
            ctx.translate(this.x, this.y);

            ctx.beginPath();

            ctx.save();
            this.drawHP(canvas, ctx);
            ctx.restore();

            ctx.beginPath();
            this.drawImpl(canvas, ctx);
        } finally {
            ctx.restore();
        }
    }

    this.drawHP = function(canvas, ctx) {
        ctx.beginPath();
        ctx.translate(-halfcell, +halfcell);
        ctx.moveTo(0, 0);
        ctx.lineTo(cellsize * (this.hp / this.maxHp), 0);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    this.setFillStyle = function(ctx) {
        if (this.dead) {
            ctx.fillStyle = "red";
        } else if (this.damageAnimation) {
            ctx.fillStyle = "lightgray";
        } else if (this.slowdown) {
            ctx.fillStyle = "lightblue";
        } else {
            ctx.fillStyle = this.baseColor;
        } 
    }

    this.beforeUpdate = function (game) {}

    return this;
}

function Walker(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    this.hp = this.maxHp = 50 * waveFactor;
    this.reward = 1;
    this.speed = 3;

    this.drawImpl = function(canvas, ctx) {
        var monster = this;

        ctx.arc(0, 0, halfcell * 0.5 - 2, 0, 2*Math.PI);
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    };
}

function BigWalker(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    this.hp = this.maxHp = 150 * waveFactor;
    this.reward = 2;
    this.speed = 1.5;

    this.drawImpl = function(canvas, ctx) {
        var monster = this;

        ctx.arc(0, 0, halfcell * 0.9 - 2, 0, 2*Math.PI);
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    };
}

function Tank(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    this.hp = this.maxHp = 1000 * waveFactor;
    this.reward = 10;
    this.speed = 0.5;

    this.drawImpl = function(canvas, ctx) {
        var monster = this;
        var target = monster.path[monster.pathIndex];
        var angle = target ? angleFrom(monster, { x: target[0], y: target[1] }) : 0;
        
        ctx.rotate(angle + Math.PI / 2);

        ctx.lineWidth = halfcell / 3;
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        for (var i = 0; i < 5; ++i) {
            ctx.moveTo(-halfcell + cellsize * (i / 5), -halfcell * 0.8);
            ctx.lineTo(-halfcell + cellsize * (i / 5), halfcell * 0.8);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(halfcell / 2, -halfcell / 2);
        ctx.lineTo(halfcell, 0);
        ctx.lineTo(halfcell / 2, halfcell / 2);
        ctx.lineTo(-halfcell, halfcell / 2);
        ctx.lineTo(-halfcell, -halfcell / 2);
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

    };
}

function Speeder(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    this.hp = this.maxHp = 100 * waveFactor;
    this.reward = 10;
    this.speed = 5.0;

    this.drawImpl = function(canvas, ctx) {
        var monster = this;
        var target = monster.path[monster.pathIndex];
        var angle = target ? angleFrom(monster, { x: target[0], y: target[1] }) : 0;
        
        ctx.rotate(angle + Math.PI / 2);
        ctx.lineWidth = halfcell / 3;
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.moveTo(-halfcell * 0.5, -halfcell * 0.8);
        ctx.lineTo(-halfcell * 0.5, halfcell * 0.8);
        ctx.moveTo(halfcell * 0.5, -halfcell * 0.8);
        ctx.lineTo(halfcell * 0.5, halfcell * 0.8);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.lineTo(-halfcell * 0.9, halfcell / 2);
        ctx.lineTo(halfcell * 0.9, halfcell / 4);
        ctx.lineTo(halfcell * 0.9, -halfcell / 4);
        ctx.lineTo(-halfcell * 0.9, -halfcell / 2);
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
}

function Flier(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    // Just head straight to the final path node
    this.path = [path[path.length - 1]];
    this.hp = this.maxHp = 30 * waveFactor;
    this.reward = 10;
    this.speed = 2.0;
    this.rotorAngle = 0;

    this.beforeUpdate = function(game) {
        this.rotorAngle += 0.5;
    }

    this.drawImpl = function(canvas, ctx) {
        var monster = this;
        var target = monster.path[monster.pathIndex];
        var angle = target ? angleFrom(monster, { x: target[0], y: target[1] }) : 0;
        ctx.rotate(angle + Math.PI / 2);
        
        ctx.beginPath();
        ctx.arc(0, 0, halfcell * 0.9, -0.5, 0.5);
        ctx.arc(0, 0, halfcell * 0.9, Math.PI-0.4, Math.PI+0.4);
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rotate(this.rotorAngle);
        var rotorSize = halfcell * 0.8;
        ctx.moveTo(0, 0); ctx.lineTo(rotorSize, 0);
        ctx.moveTo(0, 0); ctx.lineTo(-rotorSize, 0);
        ctx.moveTo(0, 0); ctx.lineTo(0, rotorSize);
        ctx.moveTo(0, 0); ctx.lineTo(0, -rotorSize);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.stroke();
        
    };
}

function Tower(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;

    this.update = function(game) {
        var tower = this;
        tower.beforeUpdate(game);
        if (tower.shootAnimation) {
            if (!--tower.shootAnimation) {
                tower.finishShoot(game);
            } else {
                tower.inShoot(game);
            }
        } else if (tower.cooldown) {
            if (!--tower.cooldown) {
                tower.finishCooldown(game);
            } else {
                tower.inCooldown(game);
            }
        } else if (tower.acquireTarget(game)) {
            tower.trackTarget(game);
        } else {
            tower.inIdle(game);
        }
        tower.afterUpdate(game);
    }

    this.beforeUpdate = function(game) {}
    this.afterUpdate = function(game) {}

    this.beginShoot = function(game) { }
    this.inShoot = function(game) {}
    this.finishShoot = function(game) {}

    this.finishCooldown = function(game) {}
    this.inCooldown = function(game) {}

    this.validTarget = function(target) {
        return target && this.inRange(target) &&
            !(target.dead || target.win)
    }

    this.acquireTarget = function(game) {
        if (this.validTarget(this.target)) {
            return true;
        } else {
            this.target = findClosest(this, game.monsters);
        }
        return this.validTarget(this.target);
    }

    this.inRange = function (object) {
        return distance(this, object) < this.range
    }
    
    this.turnToAngle = function(game, targetAngle) {
        var diff = targetAngle - this.angle;
        if (Math.abs(diff) < this.turnSpeed) {
            this.angle = targetAngle;
            this.targetInSights(game);            
        } else {
            // Turn as far toward the target as we can.
            var direction = (normalizeAngle(diff) < Math.PI ?
                             this.turnSpeed : -this.turnSpeed);
            this.angle = normalizeAngle(this.angle + direction);
        }
    }

    this.trackTarget = function(game) {
        var angle = angleFrom(this, this.target);
        this.turnToAngle(game, angle);
    }

    this.targetInSights = function(game) {
        if (!this.cooldown && this.target && this.inRange(this.target)) {
            this.beginShoot(game);
        }
    }

    this.inIdle = function(game) {
        this.turnToAngle(game, 0);
    }
}

function GunTower(x, y) {
    Tower.call(this, x, y);
    this.background = 10;
    this.range = cellsize * 1.75;
    this.cost = 5;
    this.turnSpeed = 0.2;

    this.beginShoot = function(game) {
        // Shoots every 6 ticks for 6 damage
        this.cooldown = 2;
        this.shootAnimation = 3;
        this.shootingAt = {
            x: this.target.x,
            y: this.target.y,
        };
        this.target.damage(game, 6);
    }

    this.draw = function(canvas, ctx) {
        var tower = this;

        ctx.save();
        if (tower.shootAnimation) {
            ctx.beginPath();
            ctx.moveTo(tower.x, tower.y);
            ctx.lineTo(tower.shootingAt.x, tower.shootingAt.y);
            ctx.lineWidth = tower.shootAnimation / 2;
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

function SlowTower(x, y) {
    Tower.call(this, x, y);

    this.background = 12;
    this.range = cellsize * 1.75;
    this.cost = 10;
    this.turnSpeed = 0.15;

    this.beginShoot = function(game) {
        this.cooldown = 20;
        this.shootAnimation = 5;
        this.shootingAt = {
            x: this.target.x,
            y: this.target.y,
        };
        this.target.slowdown = 30;
    }

    this.draw = function(canvas, ctx) {
        var tower = this;

        ctx.save();
        if (tower.shootAnimation) {
            ctx.beginPath();
            ctx.moveTo(tower.x, tower.y);
            ctx.lineTo(tower.shootingAt.x, tower.shootingAt.y);
            ctx.lineWidth = tower.shootAnimation * 5;
            ctx.strokeStyle = "lightblue";
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
        ctx.moveTo(halfcell * 0.1, 0);
        ctx.lineTo(halfcell * 0.4, halfcell * 1.2);
        ctx.lineTo(halfcell * -0.4, halfcell * 1.2);
        ctx.lineTo(halfcell * -0.1, 0);
        ctx.fillStyle = "black";
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
    
    return this;
}

function PulseTower(x, y) {
    Tower.call(this, x, y);

    this.background = 11;
    this.range = cellsize * 2;
    this.cost = 80;
    this.turnSpeed = 0.3;
    
    this.beforeUpdate = function(game) {
        this.angle = normalizeAngle(this.angle + this.turnSpeed);
    }

    this.beginShoot = function(game) {
        this.shootAnimation = 5;
    }

    this.finishShoot = function(game) {
        // Shoots every 26 ticks for 100 in splash damage, might miss
        // target entirely.
        var tower = this;
        _(game.monsters).each(function (monster) {
            if (tower.inRange(monster)) {
                monster.damage(game, 100);
            }
        });
        tower.cooldown = 20;
    }

    this.finishCooldown = function(game) {
        this.idleAnimation = 10;
    }

    this.inIdle = function(game) {
        if (!this.idleAnimation) {
            this.idleAnimation = 10;
        } else {
            this.idleAnimation -= 1;
        }
    }

    this.trackTarget = function(game) {
        if (!this.cooldown && this.target && this.inRange(this.target)) {
            this.beginShoot(game);
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
        } else if (tower.idleAnimation && !tower.cooldown) {
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

function MissileTower(x, y) {
    Tower.call(this, x, y);

    this.background = 11;
    this.maxRange = cellsize * 5.0;
    this.minRange = cellsize * 2.0;
    this.explosionRange = cellsize * 0.75;
    this.cost = 20;
    this.turnSpeed = 0.1;
    this.flash = false;
    this.flashCounter = 10;
    
    this.beforeUpdate = function(game) {
        if (this.explosionAnimation > 0) {
            if (!--this.explosionAnimation) {
                this.finishExplosion(game);
            }
        }
        this.flashCounter -= 1;
        if (this.flashCounter == 0) {
            if (this.flash) {
                this.flash = false;
            } else {
                this.flash = true;
            }
            this.flashCounter = 10;
        }
    }

    this.beginShoot = function(game) {
        // Shoots every 51 ticks for 30 in splash damage, might miss
        // target entirely.
        this.shootAnimation = 10;
        this.shootingAt = {
            x: this.target.x,
            y: this.target.y,
        };
    }

    this.finishShoot = function() {
        this.explosionAnimation = 5;
        this.cooldown = 40;
    }

    this.inIdle = function() {
    }
    
    this.finishExplosion = function(game) {
        var tower = this;
        _(game.monsters).each(function (monster) {
            var d = distance(tower.shootingAt, monster);
            if (d < tower.explosionRange) {
                monster.damage(game, 30);
            }
        });
    }

    this.inRange = function(object) {
        var d = distance(this, this.target);
        return d < this.maxRange && d >= this.minRange;
    }

    this.draw = function(canvas, ctx) {
        var tower = this;

        ctx.save();

        ctx.beginPath();
        ctx.translate(tower.x, tower.y);
        ctx.rotate(tower.angle);
        ctx.scale(halfcell / 10, halfcell / 10);

        // Right side of turret 
        ctx.arc(-2, 0, 7, 0.5 * Math.PI, 1.5*Math.PI);
        ctx.fillStyle = "darkgray";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Left side of turret 
        ctx.save();
        ctx.beginPath();
        ctx.rotate(1 * Math.PI);
        ctx.arc(-2, 0, 7, 0.5 * Math.PI, 1.5*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // A launch strip in a darker color in between
        ctx.beginPath();
        ctx.moveTo(-2, -7);
        ctx.lineTo(-2, 7);
        ctx.lineTo(2, 7);
        ctx.lineTo(2, -7);
        ctx.closePath();
        ctx.fillStyle = '#3D3D5C';
        ctx.fill();
        ctx.restore();

        // Finally, draw the missile, either on the launch pad, in air
        // or having exploded.
        if (tower.shootAnimation) {
            ctx.beginPath();
            var dx = tower.shootingAt.x - tower.x;
            var dy = tower.shootingAt.y - tower.y;
            var x = tower.x + dx * (10 - tower.shootAnimation) / 10;
            var y = tower.y + dy * (10 - tower.shootAnimation) / 10;
            this.drawMissile(ctx, x, y, true);
        } else if (tower.explosionAnimation) {
            ctx.beginPath();
            ctx.arc(tower.shootingAt.x,
                    tower.shootingAt.y,
                    tower.explosionRange / (5 - tower.explosionAnimation),
                    0,
                    2 * Math.PI);
            ctx.fillStyle = 'orange';
            ctx.fill();
        } else {
            this.drawMissile(ctx, this.x, this.y);
        }
    }

    this.drawMissile = function(ctx, x, y, flames) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.angle);
        ctx.scale(halfcell / 10, halfcell / 10);

        // Missile
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.lineTo(2, 9);
        ctx.lineTo(0, 13);
        ctx.lineTo(-2, 9);
        ctx.lineTo(-2, -4);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;        
        ctx.stroke();

        if (this.shootAnimation) {
            // Exhaust plumes.
            ctx.beginPath();
            ctx.moveTo(2, -4);
            ctx.lineTo(1, -7);
            ctx.lineTo(0, -8 - (10 - this.shootAnimation));
            ctx.lineTo(-1, -7);
            ctx.lineTo(-2, -4);
            ctx.closePath();
            ctx.fillStyle = "orange";
            ctx.fill();
        } else {
            // Blinking go-faster stripes, as demanded by the 9 years old
            // graphics director.
            ctx.beginPath();
            ctx.moveTo(0, -2);
            ctx.lineTo(0, 6);
            ctx.lineWidth = 1;
            if (this.flash) {
                ctx.strokeStyle = '#ff5555';
            } else {
                ctx.strokeStyle = 'white';
            }
            ctx.stroke();
        }
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
                           11: "lightgray",
                           12: "olive",
                         }
            ctx.fillStyle=colors[game.tiles[r][c]];
            ctx.fillRect(c * cellsize - halfcell, r * cellsize - halfcell,
                         cellsize, cellsize);
        }
    }

    ctx.restore();
}

function clamp(value, min, max) {
    if (min > max) { var tmp = min; min = max; max = tmp; }
    if (value < min) { return min }
    if (value > max) { return max }
    return value;
}

function updateMonster(monster, game) {
    monster.beforeUpdate(game);

    if (monster.pathIndex == monster.path.length) {
        game.monsterWin(monster);
        return;
    }

    if (monster.damageAnimation) {
        --monster.damageAnimation;
    }
    
    var target = monster.path[monster.pathIndex];
    var speed = monster.speed;
    if (monster.slowdown) {
        speed *= 0.5;
        monster.slowdown--;
    }
    var xd = target[0] - monster.x;
    var yd = target[1] - monster.y;
    var total = Math.abs(xd) + Math.abs(yd);
    if (total != 0) {
        var xdmax = speed * (xd / total);
        var ydmax = speed * (yd / total);
        monster.x += clamp(xd, -xdmax, xdmax);
        monster.y += clamp(yd, -ydmax, ydmax);
    }
    if (Math.floor(monster.x) == target[0] &&
        Math.floor(monster.y) == target[1]) {
        monster.pathIndex += 1;
    }
}

function distance_squared(a, b) {
    var xd = a.x - b.x;
    var yd = a.y - b.y;
    return xd * xd + yd * yd;
}

function distance(a, b) {
    return Math.sqrt(distance_squared(a, b));
}

function findClosest(object, list) {
    var best = null;
    var best_d = null;
    _(list).each(function (other) {
        var d = distance_squared(object, other);
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

function selectRandomTowerType() {
    var type = null;
    var r = Math.random();
    if (r < 0.1) {
        type = 'pulse';
    } else if (r < 0.2) {
        type = 'slow';
    } else if (r < 0.3) {
        type = 'missile';
    } else {
        type = 'gun';
    }
    return type;
}

var MOVE_ABS = 1;
var MOVE_REL = 2;
var BUILD_REL = 2;

function Program() {
    this.program = [];

    this.randomInstruction = function () {
        var i = Math.random();
        var c = _.random(0, 100);
        
        if (i < 0.01) {
            var a = _.random(0, cols - 1);
            var b = _.random(0, rows - 1);
            return { type: MOVE_ABS, a: a, b: b, c: c}
        } else if (i < 0.1) {
            var a = _.random(-3, 3);
            var b = _.random(-3, 3);
            return { type: MOVE_REL, a: a, b: b, c: c};
        } else {
            var a = _.random(-3, 3);
            var b = _.random(-3, 3);
            return { type: BUILD_REL, a: a, b: b, c: c};
        }
    };

    this.plan = function()  {
        var rr = Math.floor(rows / 2);
        var cc = Math.floor(cols / 2);
        return _(this.program).map(function(inst) {
            if (inst.type == MOVE_REL ||
                inst.type == BUILD_REL) {
                cc = (cc + inst.a + cols) % cols;
                rr = (rr + inst.b + rows) % rows;
            } else if (inst.type == MOVE_ABS) {
                cc = (inst.a) % cols;
                rr = (inst.b) % rows;
            }
            if (inst.type == BUILD_REL) {
                var building = "";
                switch(inst.c % 4) {
                case 0:
                    building = "gun";
                    break;
                case 1:
                    building = "slow";
                    break;
                case 2:
                    building = "pulse";
                    break;
                case 3:
                    building = "missile";
                    break;
                default:
                    throw "Bad building type";
                };
                return "build " + building + " " + cc + " " + rr;
            } else {
                return null;
            }
        }).filter(function(cmd) {
            return cmd != null;
        });
    };

    this.replaceWithRandomProgram = function() {
        var program = this;
        var instructions = _(100).range().map(function(i) {
            return program.randomInstruction();
        });
        this.program = _.shuffle(_.flatten(instructions, false));
    }
}

var speed = 1;
var game;
function init(initialPlan) {
    game = new Game();
    // Define multiple spawning points in the same location so that we can
    // generate multiple kinds of enemies / timings from a single location
    // in a single wave.
    game.addSpawnPoint(0, 4, [19, 7]);
    game.addSpawnPoint(0, 4, [19, 7]);
    game.addSpawnPoint(10, 0, [10, 11]);
    game.addSpawnPoint(10, 0, [10, 11]);
    
    if (initialPlan) {
        _(initialPlan).each(function(cmd) {
            game.plan.addCommand(cmd);
        });
    } else {
        game.plan.addCommand('build gun 8 4');
        game.plan.addCommand('build pulse 8 4');
        game.plan.addCommand('build gun 10 5');
        game.plan.addCommand('build slow 10 6');
        game.plan.addCommand('build gun 10 3');
        game.plan.addCommand('build gun 10 4');
        game.plan.addCommand('build gun 8 7');
        game.plan.addCommand('build gun 8 8');
        game.plan.addCommand('build gun 9 9');
        game.plan.addCommand('build gun 8 6');
        game.plan.addCommand('build pulse 10 7');
        game.plan.addCommand('build missile 11 5');
    }

    $('#main').each(function (index, canvas) {
        if (!canvas.getContext) {
            return;
        }
        var ctx = canvas.getContext("2d");

        cellsize = Math.floor(Math.min(canvas.width / cols,
                                       canvas.height / rows));
        halfcell = cellsize / 2;

        function updateAndDraw() {
            _(speed).times(function() { game.update() });
            // game.update();
            ctx.save();
            ctx.translate(halfcell, halfcell);
            game.draw(canvas, ctx);
            ctx.restore();
        };
        game.init(updateAndDraw);
        game.start(50);
    });
    return game;
}

function evolvePlan(popsize) {
    var generation = 1;
    var population = _(popsize).range().map(function(i) {
        var prog = new Program();
        prog.replaceWithRandomProgram();
        return prog;
    });

    function breed(a, b) {
        var insts = [];
        var current = a;
        for (var i = 0; i < a.program.length; ++i) {
            if (Math.random() < 0.05) {
                current = (current == a ? b : a)
            }
            insts.push(current.program[i])
        }
        var prog = new Program();
        prog.program = insts;
        return prog;
    }
    function mutate(a) {
        _(5).range().map(function () {
            var len = a.program.length;
            var i = _.random(0, len - 1);
            var j = _.random(0, len - 1);
            var r = Math.random();
            if (r < 0.2) {
                a.program[i] = a.randomInstruction();
            } else {
                if (r >= 0.5) {
                    j = (i + 1) % len;
                }
                var tmp = a.program[i];
                a.program[i] = a.program[j];
                a.program[j] = tmp;
            }
        });
        return a;
    }
    function evolve() {
        var scored = _(population).sortBy(function(a) {
            a.score_ = (a.score.wave << 20) + a.score.killed;
            return a.score_;
        });
        var scoreSum = 0;
        _(scored).each(function(x) {
            scoreSum += x.score_;
        });
        function randomWeightedByScore() {
            var random = Math.random() * scoreSum;
            var iterSum = 0;
            var result = _(scored).last();
            try {
                _(scored).each(function(x) {
                    iterSum += x.score_;
                    if (iterSum >= random) {
                        throw x;
                    }
                });
            } catch (expected) {
                result = expected;
            }
            return result;
        };
        var newPopulation = _(popsize).range().map(function(i) {
            var a = randomWeightedByScore();
            var b = randomWeightedByScore();
            return mutate(breed(a, b));
        });
        return newPopulation;
    }

    var maxWaveEver = 0;
    var allgens = {
        scores: [],
    };
    function updateAllGensGraph() {
        var scores = allgens.scores;
        if (!scores.length) {
            return;
        }
        $('#allgens-stats').text("All finished generations");
        $('#allgens-graph').each(function (index, canvas) {
            if (!canvas.getContext) {
                return;
            }
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            _(scores).each(function(score, index) {
                ctx.save();
                var width = Math.min(canvas.width / population.length,
                                     canvas.width / scores.length);
                var xstart = index * width;
                var heightMax = (score.max / maxWaveEver) * canvas.height;
                var heightMean = (score.mean / maxWaveEver) * canvas.height;
                
                ctx.fillStyle='darkgreen';
                ctx.fillRect(xstart, canvas.height,
                             width, -heightMax);

                ctx.fillStyle='lightgreen';
                ctx.fillRect(xstart, canvas.height,
                             width, -heightMean);
                ctx.restore();
            });
        });
    }

    function resetCurrentGen() {
        return {
            scores: [],
            max: 0,
            min: 0,
            mean: 0,
        }
    } 
    var currentgen = resetCurrentGen();
    function updateCurrentGenGraph() {
        var scores = currentgen.scores;
        if (!scores.length) {
            return;
        }
        var minWave = scores[0].wave;
        var maxWave = scores[0].wave;
        var sumWave = 0;
        _(scores).each(function(score) {
            maxWave = Math.max(score.wave, maxWave);
            minWave = Math.min(score.wave, minWave);
            sumWave += score.wave;
        });
        var avgWave = sumWave / scores.length;
        currentgen.max = maxWave;
        currentgen.min = minWave;
        currentgen.mean = avgWave;
        $('#currentgen-stats').text("Generation " + generation +
                                    ", Min: " + minWave + " Max: " + maxWave +
                                    " Mean: " + Math.round(avgWave));
        $('#currentgen-graph').each(function (index, canvas) {
            if (!canvas.getContext) {
                return;
            }
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            _(scores).each(function(score, index) {
                ctx.save();
                var width = canvas.width / population.length;
                var xstart = index * width;
                var height = (score.wave / maxWaveEver) * canvas.height;
                ctx.fillStyle='darkgreen';
                ctx.fillRect(xstart, canvas.height,
                             width, -height);
                ctx.restore();
            });
        });
    }
    
    function runTest(i) {
        if (i == popsize) {
            population = evolve();
            generation++;
            allgens.scores.push(currentgen);
            updateAllGensGraph();
            currentgen = resetCurrentGen();
            return runTest(0);
        }
        var game;
        try {
            game = init(population[i].plan());
        } catch (e) {
            console.log(e, population[i]);
            throw e;
        }
        game.onStatus = function(elem) {
            elem.innerText += ' / generation ' + generation;
            elem.innerText += ' / candidate ' + i;
        };
        game.onGameOver = function() {
            var score = { wave: game.waveIndex,
                          killed: game.monsterDeaths,
                          commands: game.plan.index};
            console.log(i, score);
            population[i].score = score;
            population[i].lastCommandIndex = game.plan.index - 1;
            currentgen.scores.push(population[i].score);
            maxWaveEver = Math.max(score.wave, maxWaveEver);
            updateCurrentGenGraph();
            runTest(i + 1);
        };
        game.start(1);
    }
    mutate(breed(population[0], population[1]));
    runTest(0);
}
