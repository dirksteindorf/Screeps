var structureFinder = require('find_structures');

module.exports = {
    spawn : function(){

        //----------------------------------------------------------------------
        // basic infrastructure on controller level 1

        // first harvesters as a foundation for the chain
        if(Memory.creepCount.harvester < 2 || Memory.creepCount.harvester < Game.rooms['W17S41'].memory.maxHarvesters){
            if(Game.spawns.Spawn1.room.energyAvailable >= 800){
                Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], "harvester"+Game.time, {role: "harvester", task: "harvesting"});
            }
            if(Game.spawns.Spawn1.room.controller.level >= 3 && Game.spawns.Spawn1.room.energyAvailable >= 500){
                Game.spawns.Spawn1.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "harvester"+Game.time, {role: "harvester", task: "harvesting"});
            }
            else if(Game.spawns.Spawn1.room.energyAvailable >= 300){
                Game.spawns.Spawn1.createCreep([WORK, CARRY, CARRY, MOVE, MOVE], "harvester"+Game.time, {role: "harvester", task: "harvesting"});
            }
        }

        // build chain
        else if(Memory.creepCount.harvester >= 2 && !Game.creeps.Chain0 && Game.spawns.Spawn1.room.energyAvailable >= 200){
            Game.spawns.Spawn1.createCreep([CARRY, CARRY, CARRY, MOVE], "Chain0", {role: "chain0"});
        }
        else if(Memory.creepCount.harvester >= 2 && Game.creeps.Chain0 && !Game.creeps.Chain1 &&
                Game.spawns.Spawn1.room.energyAvailable >= 200){
            Game.spawns.Spawn1.createCreep([CARRY, CARRY, CARRY, MOVE], "Chain1", {role: "chain1"});
        }
        else if(Memory.creepCount.harvester >= 2 && Game.creeps.Chain1 && !Game.creeps.Chain2 &&
                Game.spawns.Spawn1.room.energyAvailable >= 200){
            Game.spawns.Spawn1.createCreep([CARRY, CARRY, CARRY, MOVE], "Chain2", {role: "chain2"});
        }
        else if(Memory.creepCount.harvester >= 2 && Game.creeps.Chain2 && !Game.creeps.Chain3 &&
                Game.spawns.Spawn1.room.energyAvailable >= 200){
            Game.spawns.Spawn1.createCreep([CARRY, CARRY, CARRY, MOVE], "Chain3", {role: "chain3"});
        }
        else if(Game.creeps.Chain3 && !Game.creeps.Miner0 && Game.spawns.Spawn1.room.energyAvailable >= 300){
            Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], "Miner0", {role: "miner0"});
        }

        // second miner needs controller level 2
        else if(Game.spawns.Spawn1.room.controller.level > 1 && Game.creeps.Miner0 && !Game.creeps.Miner1 &&
                Game.spawns.Spawn1.room.energyAvailable >= 400){
            Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, CARRY, MOVE], "Miner1", {role: "miner1"});
        }

        // build upgraders when at least one miner is present
        else if(Memory.creepCount.upgrader < 3){
            if(Game.creeps.Miner1 && Game.spawns.Spawn1.room.controller.level >= 3 && Game.spawns.Spawn1.room.energyAvailable >= 800){
                Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], "upgrader"+Game.time, {role: "upgrader"});
                console.log("HERE");
            }
            else if(Game.creeps.Miner1 && Game.spawns.Spawn1.room.controller.level >= 2 && Game.spawns.Spawn1.room.energyAvailable >= 350){
                Game.spawns.Spawn1.createCreep([WORK, WORK, MOVE, CARRY, MOVE], "upgrader"+Game.time, {role: "upgrader"});
            }
            else if(Game.creeps.Miner0 && Game.spawns.Spawn1.room.controller.level >= 1 && Game.spawns.Spawn1.room.energyAvailable >= 250){
                Game.spawns.Spawn1.createCreep([WORK, MOVE, CARRY, MOVE], "upgrader"+Game.time, {role: "upgrader"});
            }
        }

        // create builders when construction sites are available and not enough builders are there
        // at the moment: 1 builder for 5 construction sites with a maximum of 4
        else if(Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES).length > Memory.creepCount.builder*5 &&
                Memory.creepCount.builder < 4 && Game.creeps.Miner0 && Game.spawns.Spawn1.room.energyAvailable >= 300){
            Game.spawns.Spawn1.createCreep([WORK, CARRY, CARRY, MOVE, MOVE], "builder"+Game.time, {role: "builder"});
        }
        // three builders when a tower needs to be built
        else if(structureFinder.findConstructionSitesWithType(STRUCTURE_TOWER).length && Memory.creepCount.builder < 3 &&
                Game.spawns.Spawn1.room.energyAvailable >= 300){
            Game.spawns.Spawn1.createCreep([WORK, CARRY, CARRY, MOVE, MOVE], "builder"+Game.time, {role: "builder"});
        }

        // create repairmen when damaged structures are found and no tower exists
        // at the moment: 1 repairman for 5 damaged structures, but 4 at most
        else if((structureFinder.findDamagedStructures().length + structureFinder.findDamagedContainers().length +
                structureFinder.findWeakWalls().length) > Memory.creepCount.repairman*5 && Memory.creepCount.repairman < 4 &&
                !structureFinder.findTowers().length &&
                Game.creeps.Miner1 && Game.spawns.Spawn1.room.energyAvailable >= 300){
                    Game.spawns.Spawn1.createCreep([WORK, CARRY, CARRY, MOVE, MOVE], "repairman"+Game.time, {role: "repairman"});
        }

        // build energyProviders when towers are found
        // 1 energyProvider per tower
        else if(Game.spawns.Spawn1.room.controller.level >= 3 &&
                Memory.creepCount.energyProvider < structureFinder.findTowers().length &&
                Game.spawns.Spawn1.room.energyAvailable >= 200){
            Game.spawns.Spawn1.createCreep([CARRY, CARRY, MOVE, MOVE], "energyProvider"+Game.time, {role: "energyProvider"});
        }
    }
}
