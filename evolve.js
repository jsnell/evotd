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
            if (r < 0.6) {
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
            a.score_ = ((a.score.wave * a.score.wave) << 10) + a.score.killed;
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
            if (r < 0.6) {
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
            a.score_ = ((a.score.wave * a.score.wave) << 10) + a.score.killed;
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
