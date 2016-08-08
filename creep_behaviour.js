var structureFinder = require('find_structures');

module.exports = {

    //--------------------------------------------------------------------------
    // basic infrastructure
    harvester: function(creep){

        // make space for the next creep before dying
        if(creep.ticksToLive == 1){
            for(var i in Game.rooms){
                var room = Game.rooms[i];
                for(var j = 0; j < room.memory.sources.length; j++){
                    if(room.memory.sources[j].id == creep.memory.source){
                        room.memory.sources[j].harvesters -= 1;
                        creep.suicide();
                    }
                }
            }
        }

        //--------------------------------------------------------------------------
        // harvesting behaviour
        if(creep.memory.task == "harvesting"){

            // switch task when energyCapacity is reached
            if(_.sum(creep.carry) == creep.carryCapacity){
                creep.memory.task = "storing";
                creep.memory.target = null;
            }

            // assign an energy source at the beginning
            if(typeof creep.memory.target === "undefined"){
                creep.memory.source = {};
                creep.memory.target = {};
                //var allSources = creep.room.find(FIND_SOURCES);
                var availableSources = [];

                for(var i = 0; i < creep.room.memory.sources.length; i++){
                    if(creep.room.memory.sources[i].harvesters < creep.room.memory.sources[i].maxHarvesters){
                        availableSources[i] = {};
                        availableSources[i] = creep.room.memory.sources[i].id;
                    }
                }

                if(availableSources.length > 1){
                    availableSources.sort(function(a,b){
                        return creep.pos.getRangeTo(Game.getObjectById(a)) - creep.pos.getRangeTo(Game.getObjectById(b));
                    });
                }

                creep.memory.source = availableSources[0];
                creep.memory.target = creep.memory.source;

                for(var i = 0; i < creep.room.memory.sources.length; i++){
                    if(creep.room.memory.sources[i].id == availableSources[0]){
                        creep.room.memory.sources[i].harvesters += 1;
                    }
                }
            }

            // harvest energy from the source
            else{
                var target = Game.getObjectById(creep.memory.target);
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }

        }

        //--------------------------------------------------------------------------
        // store harvested energy
        else if(creep.memory.task == "storing"){

            // everything is stored, choose between harvesting and gathering
            if(_.sum(creep.carry) == 0){
                // check for dropped resources
                //var drops = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                //    filter: drop => (drop.resourceType == RESOURCE_ENERGY && drop.amount > 20) ||
                //                    (drop.resourceType != RESOURCE_ENERGY)
                //});
                //if(drops){
                //    creep.memory.task = "gathering";
                //    creep.memory.target = drops.id;
                //}
                //else{
                    creep.memory.task = "harvesting";
                    creep.memory.target = creep.memory.source;
                //}
            }

            // something still needs to be stored
            else{
                if(creep.memory.target === null){
                    // first: try to fill Extensions
                    var empty_extensions = structureFinder.findEmptyExtensions();
                    if(empty_extensions.length){
                        // sort them by distance to the creep
                        empty_extensions.sort(function(a,b){
                            return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
                        });
                        creep.memory.target = empty_extensions[0].id;
                    }
                    else{
                        // second: try to fill spawns
                        var empty_spawns = structureFinder.findEmptySpawns();

                        if(empty_spawns.length){
                            // sort them by distance to the creep
                            empty_spawns.sort(function(a,b){
                                return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
                            });
                            creep.memory.target = empty_spawns[0].id;
                        }

                        // third: try to fill Storages
                        else{
                            var empty_storages = structureFinder.findEmptyStorages();
                            if(empty_storages.length){
                                // sort them by distance to the creep
                                empty_storages.sort(function(a,b){
                                    return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
                                });

                                creep.memory.target = empty_storages[0].id;
                            }

                            // at last: try to fill Containers
                            else{
                                var empty_containers = structureFinder.findEmptyContainers();
                                if(empty_containers.length){
                                    // sort them by distance to the creep
                                    empty_containers.sort(function(a,b){
                                        return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
                                    });

                                    creep.memory.target = empty_containers[0].id;
                                }
                            }
                        }
                    }
                }

                // move to target
                var target = Game.getObjectById(creep.memory.target);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else if(creep.transfer(target, RESOURCE_ENERGY) == ERR_FULL){
                    creep.memory.target = null;
                }
            }
        }

        //--------------------------------------------------------------------------
        // gather dropped resources
        /*
        else if(creep.memory.task == "gathering"){

            // creep can't carry any more
            if(_.sum(creep.carry) == creep.carryCapacity){
                creep.memory.task = "storing";
                creep.memory.target = null;
            }

            else{

            }
        }
        */
    },

    builder: function(creep){
        //----------------------------------------------------------------------
        // get energy
        if(creep.carry.energy == 0){
            //------------------------------------------------------------------
            // get structures with at least 50 energy in them
            var filled_containers = structureFinder.findFilledContainers();


            var energy_source = null;

            if(filled_containers.length){
                energy_source = filled_containers[0];
            }
            else {
                var filled_storages = structureFinder.findFilledStorages();

                if(filled_storages.length){
                    energy_source = filled_storages[0];
                }
            }

            if(energy_source){
                if(energy_source.structureType == STRUCTURE_CONTAINER ||
                    energy_source.structureType == STRUCTURE_STORAGE){
                    if(energy_source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(energy_source);
                    }
                }
                else{
                    if(energy_source.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy_source);
                    }
                }
            }
            else{
                if(Game.spawns.Spawn1.energy > 200 && Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns.Spawn1);
                }
            }
        }

        //----------------------------------------------------------------------
        // build stuff
        else{
            var c_site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            var room_controller = creep.room.controller;

            if(c_site){
                if(creep.build(c_site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(c_site);
                }
            }
        }
    },

    gatherer: function(creep){
        /*
         * CARRY, CARRY, CARRY, MOVE, MOVE, MOVE
         * store source and spawn
         * simply collect energy until bag is full
         * transport to spawn if there's room
         * otherwise transport to extensions
         * otherwise transport to container
         */

         /* old stuff
            var res = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

        // TODO: extend this, so all structures with free capacity are found
        var cont = creep.room.find(FIND_STRUCTURES, {
                    filter: {structureType : STRUCTURE_CONTAINER}
                });
        var empty_cont = [];
        for(var i in cont){
            if(_.sum(cont[i].store) < cont[i].storeCapacity){
                empty_cont.push(cont[i]);
            }
        }
        var empty_ext = [];
        var ext = creep.room.find(FIND_STRUCTURES, {
                    filter: { structureType : STRUCTURE_EXTENSION}
                });
        for(var i in ext){
            if(ext[i].energy < ext[i].energyCapacity){
                empty_ext.push(ext[i]);
            }
        }

        var stash = Game.spawns.Spawn1;

        if(empty_ext.length){
            for(var i in empty_ext){
                if(empty_ext[i].energy < empty_ext[i].energyCapacity){
                    stash = empty_ext[i];
                }
            }
        }

        else if(empty_cont.length){
            for(var i in empty_cont){
                if(_.sum(empty_cont[i].store) < empty_cont[i].storeCapacity){
                    stash = empty_cont[i];
                }
            }
        }

        if(res){
            if(creep.pickup(res) == ERR_NOT_IN_RANGE){
                creep.moveTo(res);
            }
            else if(creep.pickup(res) == ERR_FULL){
                for(var resourceType in creep.carry) {
                    if(creep.transfer(stash, resourceType) == ERR_NOT_IN_RANGE){
                        creep.moveTo(stash);
                    }
                }
            }
        }
        else{
            if(creep.carry.energy < creep.carryCapacity){
                var sources = creep.room.find(FIND_SOURCES);
                var current_source = 1;

                if(creep.harvest(sources[current_source]) == ERR_NOT_ENOUGH_RESOURCES){
                    current_source++;
                }
                if(creep.harvest(sources[current_source]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[current_source]);
                }

            }
            else{
                if(creep.transfer(stash, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(stash);
                }
            }

            //for(var resourceType in creep.carry) {
            //    if(creep.transfer(stash, resourceType) == ERR_NOT_IN_RANGE){
            //        creep.moveTo(stash);
            //    }
            //}

        }
        */
    },

    chain0: function(creep){
        if(creep.carry.energy > 0){
            creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY);
        }
        else if(creep.pos != Game.flags.Chain0.pos){
            creep.moveTo(Game.flags.Chain0.pos);
        }
    },

    chain1: function(creep){
        if(creep.carry.energy > 0){
            creep.transfer(Game.creeps.Chain0, RESOURCE_ENERGY);
        }
        else if(creep.pos.x != Game.flags.Chain1.pos){
            creep.moveTo(Game.flags.Chain1.pos);
        }
    },

    chain2: function(creep){
        if(creep.carry.energy > 0){
            creep.transfer(Game.creeps.Chain1, RESOURCE_ENERGY);
        }
        else if(creep.pos.x != Game.flags.Chain2.pos){
            creep.moveTo(Game.flags.Chain2.pos);
        }
    },

    chain3: function(creep){
        if(creep.carry.energy > 0){
            creep.transfer(Game.creeps.Chain2, RESOURCE_ENERGY);
        }
        else if(creep.pos.x != Game.flags.Chain3.pos){
            creep.moveTo(Game.flags.Chain3.pos);
        }
    },

    miner0 : function(creep){
        if(creep.carry.energy == creep.carryCapacity){
            creep.transfer(Game.creeps.Chain3, RESOURCE_ENERGY);
        }
        else{
            var source = Game.flags.Miner0.pos.findClosestByRange(FIND_SOURCES);
            if(!creep.pos.isEqualTo(Game.flags.Miner0.pos)){
                creep.moveTo(Game.flags.Miner0);
            }
            else{
                var harvest_return = creep.harvest(source);
                if(harvest_return == ERR_NOT_FOUND ||
                    harvest_return == ERR_INVALID_TARGET ||
                    harvest_return == ERR_NOT_IN_RANGE ||
                    harvest_return == ERR_NO_BODYPART){
                        Game.notify("Miner0 has problems.");
                    }
            }
        }
    },

    miner1 : function(creep){
        if(creep.carry.energy == creep.carryCapacity){
            creep.transfer(Game.creeps.Chain3, RESOURCE_ENERGY);
        }
        else{
            var source = Game.flags.Miner1.pos.findClosestByRange(FIND_SOURCES);
            if(!creep.pos.isEqualTo(Game.flags.Miner1.pos)){
                creep.moveTo(Game.flags.Miner1);
            }
            else{
                var harvest_return = creep.harvest(source);
                if(harvest_return == ERR_NOT_FOUND ||
                    harvest_return == ERR_INVALID_TARGET ||
                    harvest_return == ERR_NOT_IN_RANGE ||
                    harvest_return == ERR_NO_BODYPART){
                        Game.notify("Miner1 has problems.");
                    }
            }
        }
    },

    repairman: function(creep){
        if(creep.carry.energy == 0){
            if(Game.spawns.Spawn1.energy > 150 && Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
        else{
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => (object.hits < 0.8 * object.hitsMax && object.structureType == STRUCTURE_CONTAINER) ||
                        (object.hits < 30000 && object.structureType == STRUCTURE_RAMPART) ||
                        (object.hits < 10000 && object.hitsMax > 1 && object.structureType == STRUCTURE_WALL) ||
                        (object.hits < 2500 && object.structureType == STRUCTURE_ROAD)
            });

            // this is really confusing and not effective at all when walls are involved
            //targets.sort((a,b) => a.hits - b.hits);

            // move to closest
            targets.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));

            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    },

    upgrader: function(creep){
        //----------------------------------------------------------------------
        // get energy
        if(creep.carry.energy == 0){

            //------------------------------------------------------------------
            // find structures that can store energy
            var filled_containers = creep.room.find(FIND_STRUCTURES, {
                filter: obj => obj.structureType == STRUCTURE_CONTAINER &&
                        obj.store.energy >= 50
            });

            var filled_storages = creep.room.find(FIND_STRUCTURES, {
                filter: obj => obj.structureType == STRUCTURE_STORAGE &&
                        obj.store.energy >= 50
            });

            //------------------------------------------------------------------
            // choose energy source and get energy

            var energy_source = null;

            // TODO: choose source with the shortest distance
            if(filled_containers.length){
                energy_source = filled_containers[0];
            }
            else if(filled_storages.length){
                energy_source = filled_storages[0];
            }

            if(energy_source){
                if(energy_source.structureType == STRUCTURE_SPAWN){
                    if(energy_source.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy_source);
                    }
                }
                else{
                    if(energy_source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy_source);
                    }
                }
            }
            else{
                if(Game.spawns.Spawn1.energy > 200 && Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns.Spawn1);
                }
            }
        }
        //----------------------------------------------------------------------
        // upgrade controller
        else{
            var room_controller = creep.room.controller;


            if(creep.upgradeController(room_controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.flags.up1.pos);
            }
        }
    },

    energyProvider: function(creep){
        var towers = structureFinder.findTowers();
        towers.sort(function(a,b){return creep.pos.getRangeTo(a)- creep.pos.getRangeTo(b);});

        // get energy from different energy storages
        if(creep.carry.energy == 0){

            // get energy from containers
            var filled_containers = structureFinder.findFilledContainers();

            if(filled_containers.length){
                if(filled_containers[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(filled_containers[0]);
                }
            }
            // get energy from storage
            // TODO: error handling when storage is not available
            else if(creep.room.storage.store[RESOURCE_ENERGY] > 50){
                if(creep.room.storage.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.storage);
                }
            }

            // get energy from spawn
            else if( ( (towers[0].energy < towers[0].energyCapacity && Game.spawns.Spawn1.energy == 300) ) &&
                Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.spawns.Spawn1);
            }
        }

        // deliver energy to different destinations
        else{
            var empty_towers = structureFinder.findEmptyTowers();

            // towers are filled with energy
            if(empty_towers.length == 0){
                console.log("no tower needs energy");
                var empty_storages = structureFinder.findEmptyEnergyStorages();

                // bring energy to storage
                if(empty_storages.length){
                    if(creep.transfer(empty_storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(empty_storages[0]);
                    }
                }
            }

            // deliver energy to towers
            else{
                console.log("tower needs energy");
                empty_towers.sort(function(a,b){return creep.pos.getRangeTo(a)- creep.pos.getRangeTo(b);});

                if(creep.transfer(empty_towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(empty_towers[0]);
                }
            }
        }
    },


    //==========================================================================
    // fighting
    guard: function(creep){
        // find nearby enemies
        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10, {filter: function(i){
                        return i.owner.username !== "Source Keeper";
                    }});

        if(targets.length){
            // find closest enemy
            targets.sort(function(a,b){
                return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
            });

            if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets[0]);
            }
        }
        else{
            creep.moveTo(Game.flags.Gather1);
        }
    },

    healer: function(creep){
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object){
                return object.hits < object.hitsMax;
            }
        });

        if(target){
            if(creep.heal(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
        else{
            creep.moveTo(Game.flags.Gather1);
        }
    },

    archer: function(creep){
        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10, {filter: function(i){
                return i.owner.username !== "Source Keeper";
        }});
        var close_targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: function(i){
            return i.owner.username !== "Source Keeper";
        }});
        if(targets.length){
            // find closest enemy
            targets.sort(function(a,b){
                return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
            });

            if(close_targets.length > 1){
                creep.rangedMassAttack();
            }
            else if(creep.rangedAttack(targets[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets[0]);
            }
        }
        else{
            creep.moveTo(Game.flags.Gather1);
        }
    },

    claimer: function(creep){
        var controllers = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTROLLER}});

        if(creep.claimController(controllers[0]) == ERR_NOT_IN_RANGE){
            creep.moveTo(controllers[0]);
        }
    },

    //==========================================================================
    // let creeps do what they do
    run: function(){
        for(var i in Game.creeps){
            var creep = Game.creeps[i];

            if(creep.memory.role == "harvester"){
                this.harvester(creep);
            }
            else if(creep.memory.role == "builder"){
                this.builder(creep);
            }
            else if(creep.memory.role == "gatherer"){
                this.gatherer(creep);
            }
            else if(creep.memory.role == "repairman"){
                this.repairman(creep);
            }
            else if(creep.memory.role == "upgrader"){
                this.upgrader(creep);
            }
            else if(creep.memory.role == "testupgrader"){
                this.testupgrader(creep);
            }
            else if(creep.memory.role == "guard"){
                this.guard(creep);
            }
            else if(creep.memory.role == "healer"){
                this.healer(creep);
            }
            else if(creep.memory.role == "archer"){
                this.archer(creep);
            }
            else if(creep.memory.role == "claimer"){
                this.claimer(creep);
            }
            else if(creep.memory.role == "chain0"){
                this.chain0(creep);
            }
            else if(creep.memory.role == "chain1"){
                this.chain1(creep);
            }
            else if(creep.memory.role == "chain2"){
                this.chain2(creep);
            }
            else if(creep.memory.role == "chain3"){
                this.chain3(creep);
            }
            else if(creep.memory.role == "miner0"){
                this.miner0(creep);
            }
            else if(creep.memory.role == "miner1"){
                this.miner1(creep);
            }
            else if(creep.memory.role == "energyProvider"){
                this.energyProvider(creep);
            }
        }
    }
}
