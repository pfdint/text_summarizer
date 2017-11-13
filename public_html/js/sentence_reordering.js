//This is the module which reorders sentences for us.
SENTENCE_REORDERING = {
    
    //Defining a closure to return the function.
    retrieveSentenceReorderingFunction: function() {
        
        //Private members should be defined here.
        
        //This is never directly invoked. This is passed to the
        //array.sort() function so that we utilize the optmized sort
        //algorithm in there.
        var pageRankComparison = function (first, second) {
                if (first.pageRank < second.pageRank) {
                    return -1;
                }
                if (first.pageRank > second.pageRank) {
                    return 1; 
                }
                return 0;
            };
        
        //Takes a compound array of sentences which have been pageRanked, and
        //returns a reordered array from highest to lowest.
        var reorderSentences = function(compoundArrayOfSentences) {
            
            compoundArrayOfSentences.sort(pageRankComparison);
            
            return compoundArrayOfSentences;
            
        };
        
        return reorderSentences;
        
    }
    
};