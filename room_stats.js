module.exports = {
    update : function(){
        for(var r in Game.rooms){
            var room = Game.rooms[r];
            //------------------------------------------------------------------
            // sources
            if(!room.memory.sources){
                room.memory.sources = [];
                var sources = room.find(FIND_SOURCES);

                for(var s = 0; s < sources.length; s++){
                    room.memory.sources[s] = {};
                    room.memory.sources[s].id = sources[s].id;
                    room.memory.sources[s].harvesters = 0;
                    room.memory.sources[s].maxHarvesters = 4;
                }
            }

        }
    }
}
