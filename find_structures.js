module.exports = {
    findContainers : function(){
        return Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_CONTAINER
            }
        });
    },

    findDamagedContainers : function(){
        var containers = this.findContainers();
        return _.filter(containers, function(obj){
            return obj.hits < 0.8 * obj.hitsMax;
        });
    },

    findEmptyContainers : function(){
        return _.filter(this.findContainers(), function(obj){
            return _.sum(obj.store)+50 <= obj.storeCapacity;
        });
    },

    findFilledContainers : function(){
        return Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: obj => obj.structureType == STRUCTURE_CONTAINER &&
                    obj.store.energy >= 50
        });
    },

    findExtensions : function(){
        return Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter: {
                structureType : STRUCTURE_EXTENSION
            }
        });
    },

    findEmptyExtensions : function(){
        return _.filter(this.findExtensions(), function(obj){
            return obj.energy < obj.energyCapacity;
        });
    },

    findEmptySpawns : function(){
        return Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: obj => obj.structureType == STRUCTURE_SPAWN &&
                    obj.energy <  0.7 * obj.energyCapacity
        });
    },

    findStorages : function(){
        return Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: {
                structureType : STRUCTURE_STORAGE
            }
        });
    },

    findEmptyStorages : function(){
        return _.filter(this.findStorages(), function(obj){
            return _.sum(obj.store)+50 <= obj.storeCapacity;
        });
    },

    findFilledStorages : function(){
        return Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: obj => obj.structureType == STRUCTURE_STORAGE &&
                    obj.store.energy >= 50
        });
    },

    findEmptyEnergyStorages : function(){
        return (this.findEmptyExtensions()).concat(this.findEmptyContainers()).concat(this.findEmptyStorages());
    },

    // this does not find containers and storages
    findDamagedStructures : function(){
        return Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter: object => object.hits < Math.min(object.hitsMax, 50000)
        });
    },

    findConstructionSites : function(){
        return Game.spawns.Spawn1.room.find(FIND_MY_CONSTRUCTION_SITES);
    },

    findConstructionSitesWithType : function(cs_type){
        return Game.spawns.Spawn1.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter : obj => obj.structureType == cs_type
        })
    },

    findWeakWalls : function(){
        return Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: function(obj){
                return obj.structureType == STRUCTURE_WALL && obj.hits < 30000 && obj.hitsMax > 1;
            }
        });
    },

    findDamagedRoads : function(){
        return Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: function(obj){
                return obj.structureType == STRUCTURE_ROAD && obj.hits < 3000;
            }
        });
    },

    findTowers : function(){
        return Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter : {
                structureType : STRUCTURE_TOWER
            }
        });
    },

    findEmptyTowers : function(){
        return Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter : function(obj){
                return obj.structureType == STRUCTURE_TOWER && obj.energy < obj.energyCapacity - 50;
            }
        });
    }
}
