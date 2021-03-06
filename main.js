var creepCounter     = require('count_creeps');
var creepSpawner     = require('spawn_creeps');
var creepBehaviour   = require('creep_behaviour');
var towerController  = require('tower_control');
var structureBuilder = require('build_structures');
//var structureFinder = require('find_structures');
//var roomStatistics  = require('room_stats');

module.exports.loop = function () {
    //roomStatistics.update();
    creepCounter.init();
    creepCounter.count();
    creepSpawner.spawn();
    creepBehaviour.run();
    towerController();
    structureBuilder();
}
