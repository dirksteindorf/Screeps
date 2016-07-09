module.exports = {

    init : function(){
        Memory.creepCount = {};
        Memory.creepCount.harvester = 0;
        Memory.creepCount.guard = 0;
        Memory.creepCount.healer = 0;
        Memory.creepCount.builder = 0;
        Memory.creepCount.gatherer = 0;
        Memory.creepCount.repairman = 0;
        Memory.creepCount.claimer = 0;
        Memory.creepCount.upgrader = 0;
        Memory.creepCount.archer = 0;
        Memory.creepCount.energyProvider = 0;
    },

    count : function(){
        for(var i in Game.creeps){
            //var tmp_role = Game.creeps[i].memory.role;
            switch(Game.creeps[i].memory.role){
                case "harvester":
                    Memory.creepCount.harvester++;
                    break;
                case "guard":
                    Memory.creepCount.guard++;
                    break;
                case "healer":
                    Memory.creepCount.healer++;
                    break;
                case "builder":
                    Memory.creepCount.builder++;
                    break;
                case "gatherer":
                    Memory.creepCount.gatherer++;
                    break;
                case "repairman":
                    Memory.creepCount.repairman++;
                    break;
                case "claimer":
                    Memory.creepCount.claimer++;
                    break;
                case "upgrader":
                    Memory.creepCount.upgrader++;
                    break;
                case "archer":
                    Memory.creepCount.archer++;
                    break;
                case "energyProvider":
                    Memory.creepCount.energyProvider++;
                    break;
            }
        }
    },

    getHurtCreeps : function(){
        Game.spawns.Spawn1.room.find(FIND_MY_CREEPS, {
            filter: obj => obj.hits < obj.hitsMax
        });
    }
}
