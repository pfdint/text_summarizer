//This is the module which takes the reordered compound array of sentences and
//puts the sentences back together by the original strings. It takes a percentage
//so that it does not perform superfluous work. Not true yet. TODO: liar, fix percentage.
SENTENCE_RECONSTITUTION = {
    
    //Define a closure to return the reconsitution function.
    retrieveSentenceReconstitutionFunction: function() {
        
        //Private members should be defined here.
        
        //This is the array which will be returned, containing an array of
        //sentences which are strings.
        var simpleArrayOfSentences = [];
        
        //This takes the compound array of sentences and a proportion [0,1] and
        //reconstitutes the proportion of sentences in the array and returns a simple
        //array of sentences.
        var reconstituteSentences = function(compoundArrayOfSentences, fraction) {
            
            fraction = fraction || 1;
            
            var numberOfSentencesToReconstitute = Math.round(compoundArrayOfSentences.length * fraction);
            
            for (var sentenceIndex = 0; sentenceIndex < numberOfSentencesToReconstitute; sentenceIndex++) {
            
                var sentenceString = "";
                
                compoundArrayOfSentences[sentenceIndex].forEach(function(currentWord) {
                    
                    sentenceString += " " + currentWord.originalString;
                    
                });
                
                simpleArrayOfSentences.push(sentenceString);
                
            }
            
            return simpleArrayOfSentences;
            
        };
        
        return reconstituteSentences;
        
    }
    
};