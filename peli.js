var cellsize = 40;
var halfcell = cellsize / 2;
var rows = 12;
var cols = 20;

var waves = [
  [{ source: 1, type: Flier, count: 1, interval: 781 }, ],
  [{ source: 1, type: Walker, count: 3, interval: 202 }, ],   
  [{ source: 0, type: Walker, count: 1, interval: 683 }, ],
    [{ source: 3, type: Walker, count: 1, interval: 510 }, { source: 1, type: Walker, count: 1, interval: 568 }, ],
  [{ source: 2, type: Walker, count: 6, interval: 82 }, ],
  [{ source: 1, type: Flier, count: 1, interval: 397 }, ],
  [{ source: 2, type: Flier, count: 1, interval: 775 }, { source: 0, type: Walker, count: 1, interval: 673 }, ],
  [{ source: 3, type: Walker, count: 4, interval: 234 }, ],
  [{ source: 3, type: Flier, count: 2, interval: 302 }, ],
  [{ source: 2, type: Speeder, count: 1, interval: 222 }, ],
  [{ source: 3, type: Speeder, count: 1, interval: 849 }, { source: 0, type: BigWalker, count: 2, interval: 121 }, ],
  [{ source: 0, type: Tank, count: 1, interval: 1001 }, { source: 3, type: Walker, count: 1, interval: 814 }, ],
  [{ source: 3, type: Speeder, count: 1, interval: 242 }, { source: 2, type: Walker, count: 2, interval: 30 }, ],
  [{ source: 2, type: Walker, count: 8, interval: 113 }, ],
  [{ source: 2, type: BigWalker, count: 2, interval: 412 }, { source: 3, type: Walker, count: 5, interval: 27 }, ],
  [{ source: 2, type: Flier, count: 4, interval: 186 }, ],
  [{ source: 0, type: Speeder, count: 1, interval: 659 }, { source: 2, type: Flier, count: 2, interval: 466 }, ],
  [{ source: 1, type: BigWalker, count: 3, interval: 337 }, { source: 0, type: Speeder, count: 1, interval: 95 }, { source: 3, type: Walker, count: 1, interval: 339 }, ],
  [{ source: 3, type: Flier, count: 5, interval: 63 }, ],
  [{ source: 0, type: Walker, count: 13, interval: 65 }, ],
  [{ source: 3, type: Walker, count: 14, interval: 31 }, ],
  [{ source: 1, type: BigWalker, count: 10, interval: 54 }, ],
  [{ source: 1, type: Speeder, count: 3, interval: 195 }, { source: 0, type: Walker, count: 2, interval: 232 }, ],
  [{ source: 0, type: Walker, count: 19, interval: 43 }, ],
  [{ source: 1, type: Tank, count: 2, interval: 76 }, { source: 3, type: BigWalker, count: 3, interval: 250 }, ],
  [{ source: 3, type: Walker, count: 17, interval: 28 }, ],
  [{ source: 2, type: Walker, count: 7, interval: 21 }, { source: 1, type: Flier, count: 3, interval: 192 }, ],
  [{ source: 2, type: BigWalker, count: 13, interval: 42 }, ],
  [{ source: 3, type: Speeder, count: 4, interval: 244 }, { source: 1, type: Flier, count: 1, interval: 105 }, ],
  [{ source: 0, type: Tank, count: 1, interval: 493 }, { source: 3, type: Speeder, count: 1, interval: 606 }, { source: 2, type: Speeder, count: 1, interval: 529 }, ],
  [{ source: 0, type: BigWalker, count: 6, interval: 42 }, { source: 1, type: Walker, count: 9, interval: 100 }, ],
  [{ source: 3, type: Walker, count: 9, interval: 61 }, { source: 0, type: Tank, count: 1, interval: 460 }, { source: 1, type: BigWalker, count: 1, interval: 930 }, { source: 2, type: Walker, count: 1, interval: 703 }, ],
  [{ source: 1, type: Walker, count: 20, interval: 55 }, { source: 3, type: BigWalker, count: 1, interval: 680 }, { source: 0, type: Walker, count: 1, interval: 903 }, ],
  [{ source: 2, type: Tank, count: 1, interval: 379 }, { source: 1, type: BigWalker, count: 8, interval: 78 }, ],
  [{ source: 0, type: Walker, count: 20, interval: 43 }, { source: 2, type: Flier, count: 1, interval: 351 }, { source: 3, type: BigWalker, count: 2, interval: 444 }, { source: 1, type: Walker, count: 1, interval: 1003 }, ],
  [{ source: 3, type: Tank, count: 1, interval: 918 }, { source: 0, type: Walker, count: 16, interval: 39 }, ],
  [{ source: 1, type: Speeder, count: 5, interval: 71 }, { source: 3, type: Walker, count: 1, interval: 829 }, { source: 2, type: Flier, count: 1, interval: 1003 }, ],
  [{ source: 3, type: Flier, count: 11, interval: 29 }, { source: 1, type: Walker, count: 1, interval: 799 }, ],
  [{ source: 2, type: Walker, count: 10, interval: 29 }, { source: 0, type: Walker, count: 4, interval: 103 }, { source: 3, type: BigWalker, count: 3, interval: 318 }, ],
  [{ source: 1, type: Speeder, count: 5, interval: 29 }, { source: 2, type: Walker, count: 1, interval: 478 }, { source: 0, type: Walker, count: 1, interval: 195 }, ],
  [{ source: 1, type: Flier, count: 13, interval: 67 }, { source: 3, type: BigWalker, count: 1, interval: 705 }, ],
  [{ source: 1, type: Speeder, count: 6, interval: 40 }, { source: 3, type: Flier, count: 1, interval: 515 }, ],
  [{ source: 1, type: Flier, count: 15, interval: 22 }, ],
  [{ source: 3, type: Walker, count: 20, interval: 56 }, { source: 2, type: Speeder, count: 1, interval: 48 }, { source: 0, type: Walker, count: 5, interval: 202 }, ],
  [{ source: 3, type: BigWalker, count: 20, interval: 24 }, { source: 0, type: Walker, count: 1, interval: 22 }, ],
  [{ source: 0, type: Walker, count: 20, interval: 26 }, { source: 3, type: Walker, count: 13, interval: 55 }, ],
  [{ source: 3, type: Tank, count: 2, interval: 273 }, { source: 0, type: Flier, count: 6, interval: 16 }, ],
  [{ source: 2, type: BigWalker, count: 20, interval: 57 }, { source: 1, type: Speeder, count: 2, interval: 157 }, ],
  [{ source: 1, type: BigWalker, count: 11, interval: 37 }, { source: 2, type: Walker, count: 6, interval: 45 }, { source: 3, type: Flier, count: 1, interval: 64 }, { source: 0, type: Walker, count: 1, interval: 465 }, ],
  [{ source: 0, type: Flier, count: 16, interval: 71 }, { source: 1, type: BigWalker, count: 1, interval: 831 }, ],
  [{ source: 1, type: Flier, count: 15, interval: 37 }, { source: 3, type: BigWalker, count: 1, interval: 538 }, ],
  [{ source: 0, type: Speeder, count: 7, interval: 66 }, { source: 1, type: Walker, count: 2, interval: 263 }, ],
  [{ source: 2, type: BigWalker, count: 20, interval: 46 }, { source: 1, type: Speeder, count: 2, interval: 55 }, ],
  [{ source: 2, type: Tank, count: 6, interval: 18 }, { source: 0, type: BigWalker, count: 3, interval: 137 }, ],
  [{ source: 3, type: Walker, count: 20, interval: 24 }, { source: 1, type: Walker, count: 20, interval: 12 }, { source: 2, type: Tank, count: 1, interval: 1009 }, ],
  [{ source: 1, type: Speeder, count: 3, interval: 246 }, { source: 0, type: Speeder, count: 1, interval: 454 }, { source: 3, type: Flier, count: 4, interval: 43 }, { source: 2, type: BigWalker, count: 1, interval: 860 }, ],
  [{ source: 1, type: Flier, count: 18, interval: 47 }, ],
  [{ source: 2, type: Tank, count: 6, interval: 11 }, ],
  [{ source: 1, type: Tank, count: 6, interval: 158 }, { source: 2, type: Walker, count: 2, interval: 486 }, { source: 0, type: Walker, count: 2, interval: 507 }, ],
  [{ source: 1, type: Walker, count: 20, interval: 10 }, { source: 0, type: Tank, count: 4, interval: 250 }, { source: 2, type: Flier, count: 1, interval: 727 }, ],
  [{ source: 1, type: Tank, count: 7, interval: 142 }, { source: 0, type: BigWalker, count: 1, interval: 92 }, { source: 3, type: BigWalker, count: 2, interval: 166 }, ],
  [{ source: 3, type: Tank, count: 7, interval: 12 }, { source: 0, type: Walker, count: 1, interval: 334 }, { source: 2, type: Flier, count: 1, interval: 985 }, ],
  [{ source: 1, type: Tank, count: 2, interval: 246 }, { source: 3, type: Flier, count: 10, interval: 28 }, ],
  [{ source: 1, type: Tank, count: 7, interval: 49 }, { source: 3, type: Walker, count: 1, interval: 840 }, ],
  [{ source: 0, type: Walker, count: 20, interval: 42 }, { source: 1, type: Tank, count: 1, interval: 26 }, { source: 3, type: BigWalker, count: 4, interval: 250 }, { source: 2, type: Speeder, count: 1, interval: 128 }, ],
  [{ source: 3, type: BigWalker, count: 20, interval: 17 }, { source: 1, type: Speeder, count: 5, interval: 152 }, ],
  [{ source: 0, type: Flier, count: 20, interval: 48 }, { source: 3, type: Tank, count: 1, interval: 922 }, { source: 2, type: BigWalker, count: 1, interval: 991 }, { source: 1, type: Walker, count: 1, interval: 915 }, ],
  [{ source: 1, type: Speeder, count: 11, interval: 42 }, { source: 0, type: Walker, count: 1, interval: 745 }, { source: 3, type: Walker, count: 1, interval: 263 }, ],
  [{ source: 3, type: BigWalker, count: 20, interval: 46 }, { source: 2, type: Speeder, count: 1, interval: 526 }, { source: 0, type: Flier, count: 6, interval: 116 }, ],
  [{ source: 0, type: Tank, count: 7, interval: 55 }, { source: 1, type: Walker, count: 2, interval: 490 }, { source: 2, type: Flier, count: 1, interval: 435 }, ],
  [{ source: 0, type: Flier, count: 20, interval: 34 }, { source: 3, type: Walker, count: 4, interval: 244 }, ],
  [{ source: 0, type: Tank, count: 8, interval: 111 }, { source: 3, type: BigWalker, count: 1, interval: 338 }, ],
  [{ source: 3, type: Flier, count: 20, interval: 48 }, { source: 2, type: Speeder, count: 1, interval: 269 }, { source: 1, type: Speeder, count: 1, interval: 817 }, { source: 0, type: BigWalker, count: 1, interval: 712 }, ],
  [{ source: 2, type: BigWalker, count: 17, interval: 52 }, { source: 1, type: BigWalker, count: 17, interval: 22 }, ],
  [{ source: 0, type: Flier, count: 20, interval: 59 }, { source: 3, type: Walker, count: 13, interval: 85 }, ],
  [{ source: 3, type: Speeder, count: 11, interval: 24 }, { source: 2, type: Flier, count: 1, interval: 275 }, ],
  [{ source: 0, type: Walker, count: 20, interval: 18 }, { source: 2, type: Speeder, count: 7, interval: 91 }, { source: 3, type: Walker, count: 2, interval: 282 }, ],
  [{ source: 0, type: Speeder, count: 12, interval: 74 }, { source: 1, type: BigWalker, count: 1, interval: 141 }, ],
  [{ source: 3, type: BigWalker, count: 20, interval: 24 }, { source: 2, type: Speeder, count: 7, interval: 77 }, { source: 1, type: BigWalker, count: 1, interval: 409 }, ],
  [{ source: 2, type: Walker, count: 20, interval: 23 }, { source: 3, type: Speeder, count: 9, interval: 29 }, { source: 0, type: BigWalker, count: 1, interval: 186 }, ],
  [{ source: 1, type: Walker, count: 20, interval: 35 }, { source: 3, type: Walker, count: 20, interval: 22 }, { source: 0, type: Speeder, count: 3, interval: 55 }, ],
  [{ source: 2, type: BigWalker, count: 20, interval: 40 }, { source: 3, type: Speeder, count: 6, interval: 12 }, { source: 1, type: Flier, count: 1, interval: 600 }, { source: 0, type: BigWalker, count: 1, interval: 201 }, ],
  [{ source: 1, type: Tank, count: 3, interval: 181 }, { source: 0, type: Speeder, count: 2, interval: 420 }, { source: 3, type: Walker, count: 5, interval: 204 }, { source: 2, type: Walker, count: 2, interval: 288 }, ],
  [{ source: 1, type: Tank, count: 4, interval: 209 }, { source: 2, type: Tank, count: 1, interval: 159 }, { source: 3, type: BigWalker, count: 10, interval: 11 }, ],
  [{ source: 1, type: Flier, count: 20, interval: 25 }, { source: 0, type: Tank, count: 1, interval: 784 }, { source: 2, type: Speeder, count: 2, interval: 363 }, ],
  [{ source: 2, type: Walker, count: 20, interval: 19 }, { source: 1, type: BigWalker, count: 20, interval: 39 }, { source: 3, type: Tank, count: 1, interval: 206 }, { source: 0, type: Speeder, count: 2, interval: 54 }, ],
  [{ source: 2, type: Speeder, count: 15, interval: 72 }, { source: 3, type: Walker, count: 1, interval: 662 }, ],
  [{ source: 1, type: Tank, count: 10, interval: 108 }, { source: 3, type: BigWalker, count: 3, interval: 187 }, { source: 2, type: Walker, count: 1, interval: 788 }, ],
  [{ source: 3, type: Speeder, count: 5, interval: 88 }, { source: 2, type: Walker, count: 20, interval: 27 }, { source: 1, type: BigWalker, count: 2, interval: 243 }, { source: 0, type: Walker, count: 3, interval: 90 }, ],
  [{ source: 2, type: Tank, count: 10, interval: 106 }, { source: 0, type: Walker, count: 2, interval: 25 }, ],
  [{ source: 2, type: BigWalker, count: 19, interval: 24 }, { source: 1, type: Flier, count: 5, interval: 99 }, { source: 0, type: Walker, count: 13, interval: 79 }, ],
  [{ source: 0, type: BigWalker, count: 20, interval: 53 }, { source: 3, type: BigWalker, count: 20, interval: 47 }, { source: 1, type: Walker, count: 8, interval: 11 }, { source: 2, type: Flier, count: 1, interval: 551 }, ],
  [{ source: 2, type: Speeder, count: 6, interval: 113 }, { source: 3, type: Flier, count: 15, interval: 52 }, ],
  [{ source: 1, type: Tank, count: 4, interval: 139 }, { source: 2, type: Walker, count: 20, interval: 29 }, { source: 0, type: Speeder, count: 1, interval: 65 }, { source: 3, type: Flier, count: 1, interval: 939 }, ],
  [{ source: 1, type: BigWalker, count: 20, interval: 16 }, { source: 2, type: Tank, count: 7, interval: 63 }, ],
  [{ source: 3, type: BigWalker, count: 20, interval: 25 }, { source: 2, type: Flier, count: 17, interval: 59 }, { source: 0, type: BigWalker, count: 1, interval: 664 }, ],
  [{ source: 3, type: Tank, count: 11, interval: 12 }, { source: 1, type: BigWalker, count: 1, interval: 552 }, { source: 0, type: Walker, count: 1, interval: 770 }, { source: 2, type: Walker, count: 1, interval: 14 }, ],
  [{ source: 2, type: BigWalker, count: 20, interval: 36 }, { source: 0, type: Flier, count: 20, interval: 58 }, { source: 1, type: BigWalker, count: 1, interval: 215 }, { source: 3, type: Walker, count: 1, interval: 92 }, ],
  [{ source: 1, type: Speeder, count: 17, interval: 28 }, { source: 2, type: Walker, count: 1, interval: 618 }, ],
  [{ source: 0, type: Flier, count: 20, interval: 26 }, { source: 3, type: BigWalker, count: 20, interval: 20 }, { source: 1, type: Speeder, count: 1, interval: 592 }, { source: 2, type: Walker, count: 1, interval: 267 }, ],
  [{ source: 2, type: Flier, count: 13, interval: 36 }, { source: 1, type: Tank, count: 5, interval: 159 }, ],
  [{ source: 3, type: Walker, count: 20, interval: 20 }, { source: 1, type: Walker, count: 20, interval: 49 }, { source: 2, type: Tank, count: 1, interval: 146 }, { source: 0, type: BigWalker, count: 3, interval: 317 }, ],
  [{ source: 0, type: Flier, count: 20, interval: 38 }, { source: 2, type: Flier, count: 16, interval: 49 }, ],
];

function WithContext(ctx, params, fun) {
    ctx.save();
    try {
        if (params.translateX != null) {
            ctx.translate(params.translateX, params.translateY);
        }
        if (params.scale != null) {
            ctx.scale(params.scale, params.scale);
        }
        if (params.rotate != null) {
            ctx.rotate(params.rotate);
        }
        fun.call();
    } finally {
        ctx.restore();
    }
}

function Plan(game) {
    var plan = this;

    this.game = game
    this.commands = [];
    this.index = 0;

    this.reset = function() {
        this.commands = [];
        this.index = 0;
    };

    this.addCommand = function(command) {
        var record = this.parse(command);
        record.done = false;
        record.skipped = false;
        this.commands.push(record);
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
            case 'laser':
                type = LaserTower;
                break;
            default:
                throw "Unknown tower type '" + type + "'";
                break;
            };
            var c = parseInt(tokens.shift());
            var r = parseInt(tokens.shift());
            var record = { command: command,
                           fun: function(game) {
                               return game.addTower(c, r, type);
                           },
                           row: r,
                           col: c
                         };
            record.elem = $('<li/>', {
                'class': 'cmd'
            }).on('drop', function (event) {
                event.preventDefault();
                plan.moveBefore(plan.dragRecord, record);
                return true;
            }).on('dragover', function (event) {
                if (record.done) {
                    return false;
                }
                event.preventDefault();
                plan.highlightBefore(record);
                return true;
            }).append($('<div/>', {
                draggable: true,
                text: command
            }).on('dragstart', function (event) {
                plan.dragRecord = record;
                return true;
            }).on('dragend', function (event) {
                plan.dragRecord = null;
                plan.highlightBefore(null);
                return true;
            }))[0];
            $('#plan').append(record.elem);
            return record;
        }
        throw "Unknown command " + cmd;
    };
    
    this.maybeExecuteNext = function() {
        if (this.index >= this.commands.length) {
            return;
        }
        var current = this.commands[this.index];
        try {
            if (!current.fun(this.game)) {
                return false;
            }
            current.done = true;
        } catch (e) {
            current.skipped = true;
            current.done = true;
        }
        this.setCommandClass(current);
        this.index++;

        current = this.commands[this.index];
        if (this.index < this.commands.length) {
            this.setCommandClass(current);

            var offset = $(current.elem).position().top;
            var plan = $('#plan');
            if (plan.scrollTop() + plan.height() < offset) {
                plan.scrollTop(offset);
            }
        }
        return true;
    };

    this.highlightBefore = function(current) {
        $('#plan li').each(function (index, elem) {
            if (current && current.elem === elem) {
                elem.style.borderStyle = "solid none none none";
            } else {
                elem.style.borderStyle = "none";
            }
        });
    }
    
    this.dequeue = function(record) {
        // Can't remove commands that have already been executed.
        if (record.done) {
            return;
        }

        $(record.elem).detach();
        var commands = plan.commands;
        var recordIndex = commands.indexOf(record);
        commands.splice(recordIndex, 1);
        if (recordIndex < commands.length) {
            plan.setCommandClass(commands[recordIndex]);
        }
    }

    this.moveBefore = function(record, beforeRecord) {
        var prev;
        var next;
        var commands = plan.commands;

        // Can't rearrange commands that have already been executed.
        if (record.done || beforeRecord.done) {
            return;
        }

        var recordIndex = commands.indexOf(record);
        commands.splice(recordIndex, 1);
        var beforeRecordIndex = commands.indexOf(beforeRecord);
        commands.splice(beforeRecordIndex, 0, record);
        
        var elems = $('#plan li.cmd');
        elems.detach();
        $('#plan').append(_(commands).map(function (record) {
            plan.setCommandClass(record);
            return record.elem;
        }));
    }

    this.setCommandClass = function(record) {
        var classes = ['cmd'];
        if (record.skipped) {
            classes.push('cmd-skipped');
        } else if (record.done) {
            classes.push('cmd-done');
        } else if (record === plan.commands[plan.index]) {
            classes.push('cmd-current');
        }
        record.elem.className = classes.join(' ');
    }

    this.queuedAt = function(column, row) {
        return _(plan.commands).filter(function(record) {
            return column == record.col && row == record.row && !record.done;
        });
    }
    
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
    this.win = false;
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
        if (this.waveIndex == waves.length - 1) {
            this.gameOver = true;
            this.win = true;
            if (this.onGameOver) {
                this.onGameOver();
            }
            return;
        }
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
            var text = this.win ? "YOU WIN" : "GAME OVER";
            ctx.fillText(text, 20, 33);
            ctx.strokeText(text, 20, 33);
            ctx.restore();
            return;
        }

        drawMap(canvas, ctx);
        _(this.plan.commands).each(function (record) {
            if (!(record.done || record.skipped)) {
                WithContext(ctx, { translateX: column(record.col),
                                   translateY: row(record.row) },
                            function() {
                                ctx.fillStyle = "blue";
                                ctx.fillRect(-cellsize / 8, -cellsize / 8,
                                             cellsize / 4, cellsize / 4);
                            });
            }
        });
        _(this.towers).each(function (tower) {
            tower.draw(canvas, ctx);
            if (game.selectedLocation &&
                tower.column == game.selectedLocation.column &&
                tower.row == game.selectedLocation.row) {
                tower.drawRange(canvas, ctx);
            }
        });
        _(this.monsters).each(function (monster) {
            monster.draw(canvas, ctx);
        });
        _(this.monsters).each(function (monster) {
            monster.draw(canvas, ctx);
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
        tower.column = c;
        tower.row = r;
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
    var monster = this;

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
        WithContext(ctx, { translateX: monster.x, translateY: monster.y,
                           scale: halfcell / 10 },
                    function () {
                        monster.drawHP(canvas, ctx);

                        ctx.beginPath();
                        monster.drawImpl(canvas, ctx);
                    });
    }

    this.drawHP = function(canvas, ctx) {
        WithContext(ctx, { translateX: -10, translateY: 10, },
                    function () {
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        var hpratio = monster.hp / monster.maxHp;
                        ctx.lineTo(20 * Math.max(0, hpratio), 0);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "red";
                        ctx.stroke();
                    });
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

        ctx.arc(0, 0, 5, 0, 2*Math.PI);
        ctx.lineWidth = 1;
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
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

        ctx.arc(0, 0, 8, 0, 2*Math.PI);
        ctx.lineWidth = 1;
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.fill();
        ctx.stroke();
    };
}

function Tank(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    this.hp = this.maxHp = 2000 * waveFactor;
    this.reward = 10;
    this.speed = 0.5;

    this.drawImpl = function(canvas, ctx) {
        var monster = this;
        var target = monster.path[monster.pathIndex];
        var angle = target ? angleFrom(monster, { x: target[0], y: target[1] }) : 0;
        
        ctx.rotate(angle + Math.PI / 2);

        WithContext(ctx, {}, function () {
            ctx.beginPath();
            for (var i = -8; i < 8 ; i += 3.5) {
                ctx.moveTo(i, -8);
                ctx.lineTo(i, 8);
            }
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        });

        ctx.beginPath();
        ctx.moveTo(6, -5);
        ctx.lineTo(10, 0);
        ctx.lineTo(6, 5);
        ctx.lineTo(-10, 5);
        ctx.lineTo(-10, -5);
        ctx.closePath();

        ctx.lineWidth = 1;
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.fill();
        ctx.stroke();
    };
}

function Speeder(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    this.hp = this.maxHp = 150 * waveFactor;
    this.reward = 5;
    this.speed = 5.0;

    this.drawImpl = function(canvas, ctx) {
        var monster = this;
        var target = monster.path[monster.pathIndex];
        var angle = target ? angleFrom(monster, { x: target[0], y: target[1] }) : 0;
        
        ctx.rotate(angle + Math.PI / 2);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.moveTo(-5, -8);
        ctx.lineTo(-5, 8);
        ctx.moveTo(5, -8);
        ctx.lineTo(5, 8);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.lineTo(-9, 5);
        ctx.lineTo(9, 2.5);
        ctx.lineTo(9, -2.5)
        ctx.lineTo(-9, -5);
        ctx.closePath();

        ctx.lineWidth = 1;
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.fill();
        ctx.stroke();
    };
}

function Flier(x, y, path, waveFactor) {
    Monster.call(this, x, y, path);

    // Just head straight to the final path node
    this.path = [path[path.length - 1]];
    this.hp = this.maxHp = 90 * waveFactor;
    this.reward = 3;
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
        ctx.arc(0, 0, 9, -0.5, 0.5);
        ctx.arc(0, 0, 9, Math.PI-0.4, Math.PI+0.4);
        this.setFillStyle(ctx);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rotate(this.rotorAngle);
        var rotorSize = 8;
        ctx.moveTo(0, 0); ctx.lineTo(rotorSize, 0);
        ctx.moveTo(0, 0); ctx.lineTo(-rotorSize, 0);
        ctx.moveTo(0, 0); ctx.lineTo(0, rotorSize);
        ctx.moveTo(0, 0); ctx.lineTo(0, -rotorSize);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
        
    };
}

function Tower(x, y) {
    var tower = this;
    this.x = x;
    this.y = y;
    this.angle = 0;

    this.drawRange = function(canvas, ctx) {
        WithContext(ctx, { translateX: tower.x, translateY: tower.y },
                    function () {
                        ctx.strokeStyle = "red";
                        ctx.lineWidth = 2;
                        if (tower.range) {
                            ctx.beginPath();
                            ctx.arc(0, 0, tower.range, 0, 2*Math.PI);
                            ctx.stroke();
                        }
                        if (tower.minRange) {
                            ctx.beginPath();
                            ctx.arc(0, 0, tower.minRange, 0, 2*Math.PI);
                            ctx.stroke();
                        }
                        if (tower.maxRange) {
                            ctx.beginPath();
                            ctx.arc(0, 0, tower.maxRange, 0, 2*Math.PI);
                            ctx.stroke();
                        }
                    });
    }
    
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

        if (tower.shootAnimation) {
            WithContext(ctx, {}, function () {
                ctx.beginPath();
                ctx.moveTo(tower.x, tower.y);
                ctx.lineTo(tower.shootingAt.x, tower.shootingAt.y);
                ctx.lineWidth = tower.shootAnimation / 2;
                ctx.strokeStyle = "red";
                ctx.stroke();
            });
        }

        WithContext(ctx, { translateX: tower.x, translateY: tower.y,
                           scale: halfcell / 10,
                           rotate: tower.angle },
                    function () {
                        ctx.beginPath();
                        ctx.arc(0, 0, 9, 0, 2*Math.PI);
                        ctx.fillStyle = "darkgray";
                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 1;
                        ctx.fill();
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, 15);
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    });
    }

    return this;
}

function SlowTower(x, y) {
    Tower.call(this, x, y);

    this.background = 12;
    this.range = cellsize * 1.75;
    this.cost = 11;
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

        if (tower.shootAnimation) {
            WithContext(ctx, {}, function () {
                ctx.beginPath();
                ctx.moveTo(tower.x, tower.y);
                ctx.lineTo(tower.shootingAt.x, tower.shootingAt.y);
                ctx.lineWidth = tower.shootAnimation * 5;
                ctx.strokeStyle = "lightblue";
                ctx.stroke();
            });
        }

        WithContext(ctx, { translateX: tower.x, translateY: tower.y,
                           scale: halfcell / 10,
                           rotate: tower.angle },
                    function () {
                        ctx.beginPath();
                        ctx.arc(0, 0, 9, 0, 2*Math.PI);
                        ctx.fillStyle = "darkgray";
                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 1;
                        ctx.fill();
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(1, 0);
                        ctx.lineTo(4, 12);
                        ctx.lineTo(-4, 12);
                        ctx.lineTo(-1, 0);
                        ctx.fillStyle = "black";
                        ctx.closePath();
                        ctx.fill();
                    });
    }
    
    return this;
}

function PulseTower(x, y) {
    Tower.call(this, x, y);

    this.background = 11;
    this.range = cellsize * 2.1;
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
        WithContext(ctx, { translateX: tower.x, translateY: tower.y,
                           rotate: tower.angle },
                    function () {
                        // Outer turret
                        ctx.beginPath();
                        ctx.arc(0, 0, halfcell * 0.9, 0, 2*Math.PI);
                        ctx.fillStyle = "orange";
                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 2;
                        ctx.fill();
                        ctx.stroke();

                        // Inner turrent
                        ctx.beginPath();
                        ctx.arc(0, 0, halfcell * 0.5, 0, 2*Math.PI);
                        ctx.fillStyle = "black";
                        ctx.lineWidth = 1;
                        ctx.fill();

                        // Little spars on the inner turrnet
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

                        // The pulse
                        ctx.beginPath();

                        if (tower.shootAnimation) {
                            // Shooting: expanding rapidly from zero
                            // all the way to max range.
                            var r = cellsize +
                                (tower.range - cellsize) *
                                (5 - tower.shootAnimation) / 5;
                            ctx.arc(0, 0, r, 0, 2*Math.PI);
                        } else if (tower.idleAnimation && !tower.cooldown) {
                            // Idling; oscillate inside the turret
                            ctx.arc(0, 0, (halfcell - tower.idleAnimation) / 2,
                                    0, 2*Math.PI);
                        }

                        // Two strokes of different widths to add a bit of a
                        // depth effect.
                        ctx.strokeStyle = "steelblue";
                        ctx.lineWidth = 4;
                        ctx.stroke();

                        ctx.strokeStyle = "white";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    });
    }

    return this;
}

function MissileTower(x, y) {
    Tower.call(this, x, y);
    var tower = this;

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
        WithContext(ctx, { translateX: tower.x, translateY: tower.y,
                           scale: halfcell / 10,
                           rotate: tower.angle },
                    function() {
                        ctx.beginPath();

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
                    });

        // Finally, draw the missile, either on the launch pad, in air
        // or having exploded.
        if (tower.shootAnimation) {
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
        } else if (!this.cooldown) {
            this.drawMissile(ctx, this.x, this.y);
        }
    }

    this.drawMissile = function(ctx, x, y, flames) {
        WithContext(ctx, { translateX: x, translateY: y,
                           scale: halfcell / 10,
                           rotate: tower.angle },
                    function () {
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

                        if (tower.shootAnimation) {
                            // Exhaust plumes.
                            ctx.beginPath();
                            ctx.moveTo(2, -4);
                            ctx.lineTo(1, -7);
                            ctx.lineTo(0, -8 - (10 - tower.shootAnimation));
                            ctx.lineTo(-1, -7);
                            ctx.lineTo(-2, -4);
                            ctx.closePath();
                            ctx.fillStyle = "orange";
                            ctx.fill();
                        } else {
                            // Blinking go-faster stripes, as demanded
                            // by the 9 years old graphics director.
                            ctx.beginPath();
                            ctx.moveTo(0, -2);
                            ctx.lineTo(0, 6);
                            ctx.lineWidth = 1;
                            if (tower.flash) {
                                ctx.strokeStyle = '#ff5555';
                            } else {
                                ctx.strokeStyle = 'white';
                            }
                            ctx.stroke();
                        }
                    });
    }
    
    return this;
}

function LaserTower(x, y) {
    Tower.call(this, x, y);
    var tower = this;

    this.background = 13;
    this.range = cellsize * 2.5;
    this.cost = 85;
    this.turnSpeed = 0.05;

    this.beginShoot = function(game) {
        this.shootAnimation = 10;
        this.shootingAt = {
            x: this.target.x,
            y: this.target.y,
        };
        this.cooldown = 100;
        this.target.damage(game, 500);
    }

    this.draw = function(canvas, ctx) {
        if (tower.shootAnimation) {
            WithContext(ctx, {}, function () {
                ctx.beginPath();
                ctx.moveTo(tower.x, tower.y);
                ctx.lineTo(tower.shootingAt.x, tower.shootingAt.y);
                ctx.lineWidth = tower.shootAnimation / 2;
                ctx.strokeStyle = "#22ee22";
                ctx.stroke();

                ctx.lineWidth = tower.shootAnimation / 4;
                ctx.strokeStyle = "white";
                ctx.stroke();
            });
        }

        WithContext(ctx, { translateX: tower.x, translateY: tower.y,
                           scale: halfcell / 10 },
                    function () {
                        ctx.rotate(tower.angle);

                        ctx.beginPath();
                        ctx.moveTo(-1, 0);
                        ctx.lineTo(-1, 7);
                        ctx.lineTo(1, 7);
                        ctx.lineTo(1, 0);
                        ctx.closePath();
                        ctx.lineWidth = 0.5;
                        ctx.strokeStyle = "red";
                        ctx.fillStyle = "black";
                        ctx.fill();
                        if (!tower.cooldown) {
                            ctx.stroke();
                        }

                        ctx.beginPath();
                        ctx.moveTo(-4, -2);
                        ctx.lineTo(-4, 5);
                        ctx.moveTo(4, -2);
                        ctx.lineTo(4, 5);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        ctx.fillStyle = "black";
                        ctx.fill();
                        ctx.stroke();
                        
                        ctx.beginPath();
                        ctx.moveTo(-5, 0);
                        ctx.lineTo(-6, -2);
                        ctx.lineTo(-6, -4);
                        ctx.lineTo(-5, -5);
                        ctx.lineTo(5, -5);
                        ctx.lineTo(6, -4);
                        ctx.lineTo(6, -2);
                        ctx.lineTo(5, 0);
                        ctx.closePath();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        ctx.fillStyle = "red";
                        ctx.fill();
                        ctx.stroke();
                        
                    });
    }

    return this;
}

function drawMap(canvas, ctx) {
    WithContext(ctx, {}, function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var r = 0; r < rows; ++r) {
            for (var c = 0; c < cols; ++c) {
                var colors = { 0: "darkgreen",
                               2: "red",
                               3: "lightblue",
                               10: "yellow",
                               11: "lightgray",
                               12: "olive",
                               13: "gray",
                             }
                ctx.fillStyle=colors[game.tiles[r][c]];
                ctx.fillRect(c * cellsize - halfcell, r * cellsize - halfcell,
                             cellsize, cellsize);
            }
        }
    });
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
                switch(inst.c % 5) {
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
                case 4:
                    building = "laser";
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

function menuClickHandler(title, pageX, pageY, funs) {
    var menu = $("#menu");
    menu.hide();
    menu.empty();
    var head = $("<div/>", {"style": "width: 100%"});
    head.append($("<div/>", {
        style: "white-space: nowrap",
        text: title
    }));
    menu.append(head);
    
    _(funs).each(function (record) {
        var button = $('<button/>', { text: record.title });
        button.on('click', function() {
            menu.hide();
            record.fun();
        });
        menu.append($("<div/>", { "class": "menu-item"}).append(button));
    });

    var cancel = $('<button/>', { text: "Cancel" });
    menu.append($("<div/>", { "class": "menu-item"}).append(cancel));
    cancel.on('click', function () { menu.hide(); });

    menu.each(function (index, elem) {
        elem.style.left = (pageX - 15) + "px";
        elem.style.top = (pageY - 15) + "px";
    });

    menu.show();
}

function showQueueBuildMenu(event) {
    funs = []
    var loc = column + " " + row;
    funs.push({
        title: "Gun Tower ($5)",
        fun: function() { game.plan.addCommand("build gun " + loc) },
    });
    funs.push({
        title: "Slow Tower ($11)",
        fun: function() { game.plan.addCommand("build slow " + loc) },
    });
    funs.push({
        title: "Missile Tower ($20)",
        fun: function() { game.plan.addCommand("build missile " + loc) },
    });
    funs.push({
        title: "Pulse Tower ($80)",
        fun: function() { game.plan.addCommand("build pulse " + loc) },
    });
    funs.push({
        title: "Laser Tower ($85)",
        fun: function() { game.plan.addCommand("build laser " + loc) },
    });
    menuClickHandler("Queue command", event.pageX, event.pageY,
                     funs);
}

function showDequeueMenu(event, records) {
    funs = []
    var loc = column + " " + row;
    _(records).each(function(record) {
        funs.push({
            title: "Deque '" + record.command + "'",
            fun: function() { game.plan.dequeue(record) },
        });
    });
    menuClickHandler("Dequeue command", event.pageX, event.pageY,
                     funs);
}

function mapClickHandler(event) {
    $("menu").hide();
    game.selectedLocation = null;
    var position = $("#main")[0].getBoundingClientRect();
    var x = event.clientX - position.left;
    var y = event.clientY - position.top;
    var row = as_row(y);
    var column = as_column(x);
    game.selectedLocation = { row: row, column: column };
    if (game.tiles[row][column] == 0) {
        var records = game.plan.queuedAt(column, row);
        console.log(records);
        if (records.length) {
            showDequeueMenu(event, records);
        } else {
            showQueueBuildMenu(event);
        }
    }
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
    
    $('#plan').empty();
    if (initialPlan) {
        _(initialPlan).each(function(cmd) {
            game.plan.addCommand(cmd);
        });
    } else {
        game.plan.addCommand('build missile 11 5');
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
        
        $(canvas).on('click', function (event) {
            mapClickHandler(event);
        });
        
        function updateAndDraw() {
            _(speed).times(function() { game.update() });
            WithContext(ctx, { translateX: halfcell, translateY: halfcell },
                        function () {
                            game.draw(canvas, ctx);
                        });
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
