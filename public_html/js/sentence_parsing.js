//This is the module which will take the array of sentences returned by the sentence mastication
//module and turn those sentences into arrays of words, where the words have all sorts of properties.
SENTENCE_PARSING = {
    
    //define a closure to return the sentence parsing function
    retrieveSentenceParsingFunction: function() {
        
        //Private members should be defined here.
        
        //This is the array which the function will eventually return.
        var compoundArrayOfSentences = [];
        
        //This is the regex which defines the characters which will be left alone
        //and thus included in the word.string property.
        var whiteList = /[^a-zA-Z\d%$]/g;
        
        //helper function to sanitize words. Takes a string, returns another string.
        var sanitizeWord = function(word) {
            return word.replace(whiteList, "").toLowerCase();
        };
        
        //The sentence parser itself. Takes an array of sentences, returns a
        //compound array of sentences of word objects.
        var parseSentences = function(arrayOfSentences) {
            
            arrayOfSentences.forEach(function(currentSentence) {
                
                var wordsInSentence = currentSentence.split(" ");
                
                var arrayOfWordObjects = [];
                
                wordsInSentence.forEach(function(currentWord) {
                    
                    var wordObject = {
                        originalString: currentWord,
                        string: sanitizeWord(currentWord),
                        weight: 0
                    };
                    
                    arrayOfWordObjects.push(wordObject);
                    
                });
                
                compoundArrayOfSentences.push(arrayOfWordObjects);
                compoundArrayOfSentences.magnitude = 0;
                compoundArrayOfSentences.pageRank = 0;
                
            });
            
            return compoundArrayOfSentences;
            
        };
        
        return parseSentences;
        
    }
    
};