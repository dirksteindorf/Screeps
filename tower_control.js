var structureFinder = require('find_structures');
//var creepCounter    = require('count_creeps');

module.exports = function(){
    var towers = structureFinder.findTowers();

    if(towers.length){
        // get enemy creeps
        var enemy_creeps = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);

        for(var i in towers){

            // if enemies -> attack
            if(enemy_creeps.length){
                enemy_creeps.sort(function(a,b){
                    return towers[i].pos.getRangeTo(a) - towers[i].pos.getRangeTo(b);
                });

                towers[i].attack(enemy_creeps[0]);
            }
            else if(towers[i].energy > 250){
                // if hurt creeps -> heal
                var hurt_creeps = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS, {
                    filter: obj => obj.hits < obj.hitsMax
                });

                // WHY does this not work?
                //var hurt_creeps = creepCounter.getHurtCreeps();

                if(hurt_creeps.length){
                    towers[i].heal(hurt_creeps[0]);
                }
                else{
                    // else if damaged structures -> repair
                    var damaged_structures = structureFinder.findDamagedStructures();
                    damaged_structures = damaged_structures.concat(structureFinder.findDamagedRoads());
                    damaged_structures = damaged_structures.concat(structureFinder.findDamagedContainers());

                    if(damaged_structures.length){
                        towers[i].repair(damaged_structures[0]);
                    }
                    else{
                        var weak_walls = structureFinder.findWeakWalls();

                        if(weak_walls.length){
                            towers[i].repair(weak_walls[0]);
                        }
                    }
                }

            }
        }



    }
}
