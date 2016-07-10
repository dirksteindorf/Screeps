module.exports = {
    update : function(){
        for(var r in Game.rooms){
            //------------------------------------------------------------------
            // sources
            var sources = r.find(FIND_SOURCES);

            // only once, harvesters will be updated elsewhere
            if(r.memory.sources.length != sources.length){
                for(var s = 0; s < sources.length; s++){
                    r.memory.sources[s].id = sources[s].id;
                    r.memory.sources[s].harvesters = 0;
                    r.memory.sources[s].maxHarvesters = 4;
                }
            }

        }
    }
}
