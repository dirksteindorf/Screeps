var structureFinder = require('find_structures');

module.exports = function(){

    //--------------------------------------------------------------------------
    // controller level 3
    if(Game.spawns.Spawn1.room.controller.level == 3){
        var towerCount = structureFinder.findTowers().length;

        // create construction site for tower at flag
        if(towerCount == 0){
            if(Game.flags.Tower1 &&  towerCount == 0){
                console.log("set construction site for tower");
                if(Game.spawns.Spawn1.room.createConstructionSite(Game.flags.Tower1, STRUCTURE_TOWER) == OK) {
                    Game.flags.Tower1.remove();
                }
            }
        }

        // create construction sites for extensions
        else{
            if(Game.flags.Extension31){
                if(Game.spawns.Spawn1.room.createConstructionSite(Game.flags.Extension31, STRUCTURE_EXTENSION) == OK){
                    Game.flags.Extension31.remove();
                }
            }
            if(Game.flags.Extension32){
                if(Game.spawns.Spawn1.room.createConstructionSite(Game.flags.Extension32, STRUCTURE_EXTENSION) == OK){
                    Game.flags.Extension32.remove();
                }
            }
            if(Game.flags.Extension33){
                if(Game.spawns.Spawn1.room.createConstructionSite(Game.flags.Extension33, STRUCTURE_EXTENSION) == OK){
                    Game.flags.Extension33.remove();
                }
            }
            if(Game.flags.Extension34){
                if(Game.spawns.Spawn1.room.createConstructionSite(Game.flags.Extension34, STRUCTURE_EXTENSION) == OK){
                    Game.flags.Extension34.remove();
                }
            }
            if(Game.flags.Extension35){
                if(Game.spawns.Spawn1.room.createConstructionSite(Game.flags.Extension35, STRUCTURE_EXTENSION) == OK){
                    Game.flags.Extension35.remove();
                }
            }

            // create construction sites between flags
            // only straight lines
            if(Game.flags.Start && Game.flags.End){
                var pos1 = Game.flags.Start.pos;
                var pos2 = Game.flags.End.pos;

                var minX = (pos1.x < pos2.x) ? pos1.x : pos2.x;
                var maxX = (pos1.x < pos2.x) ? pos2.x : pos1.x;
                var minY = (pos1.y < pos2.y) ? pos1.y : pos2.y;
                var maxY = (pos1.y < pos2.y) ? pos2.y : pos1.y;

                if(pos1.x == pos2.x){
                    for(var i=minY; i <= maxY; i++){
                        Game.spawns.Spawn1.room.createConstructionSite(new RoomPosition(pos1.x, i, 'sim'), STRUCTURE_WALL);
                    }
                }
                else if(pos1.y == pos2.y){
                    for(var i=minX; i <= maxX; i++){
                        Game.spawns.Spawn1.room.createConstructionSite(new RoomPosition(i, pos1.y, 'sim'), STRUCTURE_WALL);
                    }
                }
                Game.flags.Start.remove();
                Game.flags.End.remove();
            }
        }
    }

    //--------------------------------------------------------------------------
    // controller level 4
    else if(Game.spawns.Spawn1.room.controller.level == 4){
        if(Game.flags.Extension41Start && Game.flags.Extension41End){
            var pos1 = Game.flags.Extension41Start.pos;
            var pos2 = Game.flags.Extension41End.pos;

            var minX = (pos1.x < pos2.x) ? pos1.x : pos2.x;
            var maxX = (pos1.x < pos2.x) ? pos2.x : pos1.x;
            var minY = (pos1.y < pos2.y) ? pos1.y : pos2.y;
            var maxY = (pos1.y < pos2.y) ? pos2.y : pos1.y;

            if(pos1.x == pos2.x){
                for(var i=minY; i <= maxY; i++){
                    Game.spawns.Spawn1.room.createConstructionSite(new RoomPosition(pos1.x, i, 'sim'), STRUCTURE_EXTENSION);
                }
            }
            else if(pos1.y == pos2.y){
                for(var i=minX; i <= maxX; i++){
                    Game.spawns.Spawn1.room.createConstructionSite(new RoomPosition(i, pos1.y, 'sim'), STRUCTURE_EXTENSION);
                }
            }
            Game.flags.Extension41Start.remove();
            Game.flags.Extension41End.remove();
        }
    }

    //--------------------------------------------------------------------------
    // controller level 4
    else if(Game.spawns.Spawn1.room.controller.level == 5){

    }
}
