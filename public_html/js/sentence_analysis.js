//This is the module which nondestructively injects analysis information into
//the compound array of sentences which it is passed, and returns the same array,
//but ready for pageRanking.
SENTENCE_ANALYSIS = {
    
    //Define closure to return sentence analysis function.
    retrieveSentenceAnalysisAlgorithm: function() {
        
        //Private members should be defined here.
        
        //This is the similarit matrix referenced by pagerank calculations. It must
        //be initialized before use.
        var similarityMatrix = [];
        
        //This is the associative array which is used as the dictionary for the document.
        //It contains numbers which represent the frequency of the word entry in the document.
        var documentDictionary = {};
        
        //This sets all entries in the similarity matrix to 0. Takes a size, returns 
        //nothing (sideffect: fills matrix).
        var initializeSimilarityMatrix = function(size) {
            for (var outerIndex = 0; outerIndex < size; outerIndex++) {
                similarityMatrix[outerIndex] = [];
                for (var innerIndex = 0; innerIndex < size; innerIndex++) {
                    similarityMatrix[outerIndex][innerIndex] = 0;
                }
            }
        };
        
        //This takes the compound array and returns nothing, injecting the frequency
        //information into each word object.
        var computeFrequencies = function(compoundArrayOfSentences) {
            
            compoundArrayOfSentences.forEach(function(currentSentence) {
                
                currentSentence.sentenceDictionary = {};
                
                currentSentence.forEach(function(currentWord) {
                    
                    if (currentSentence.sentenceDictionary.hasOwnProperty(currentWord.string)) {
                        currentWord.frequencyInSentence = currentSentence.sentenceDictionary[currentWord.string].frequencyInSentence;
                        currentWord.frequencyInSentence.value += 1;
                    } else {
                        currentSentence.sentenceDictionary[currentWord.string] = currentWord;
                        currentWord.frequencyInSentence = {
                            value: 0
                        };
                    }
                    
                    if (documentDictionary.hasOwnProperty(currentWord.string)) {
                        currentWord.frequencyInDocument = documentDictionary[currentWord.string].frequencyInDocument;
                        currentWord.frequencyInDocument.value += 1;
                    } else {
                        documentDictionary[currentWord.string] = currentWord;
                        currentWord.frequencyInDocument = {
                            value: 0
                        };
                    }
                    
                });
                
            });
            
        };
        
        //This is a simple function to compute the weight of each word. Takes a compound
        //array, returns nothing, after injecting each word with its weight.
        var computeWeights = function(compoundArrayOfSentences) {
            compoundArrayOfSentences.forEach(function(currentSentence) {
                currentSentence.forEach(function(currentWord) {
                    currentWord.weight = currentWord.frequencyInSentence.value * currentWord.frequencyInDocument.value;
                });
            });
        };
        
        //This takes the compound array and attaches a magnitude to each sentence.
        //It returns nothing.
        var computeMagnitudes = function(compoundArrayOfSentences) {
            compoundArrayOfSentences.forEach(function(currentSentence) {
                
                var sumOfSquares = 0;
                currentSentence.forEach(function(currentWord) {
                    sumOfSquares += (currentWord.weight * currentWord.weight);
                });
                currentSentence.magnitude = Math.sqrt(sumOfSquares);
                
            });
        };
        
        //This takes a compound array of sentences which have magnitude and fills in
        //the similarity matrix for the values it finds. It returns nothing. It uses
        //helper function updateSimilarityMatrix since the graph is nondirectional.
        //It uses helper function computeSimilarityBetweenSentences.
        var computeSimilarityMatrix = function(compoundArrayOfSentences) {
            
            //This helper method takes the entry position to be filled with the value and
            //fills it, also filling the transpose of the position. It returns nothing,
            //and operates on the similarity matrix.
            var updateSimilarityMatrix = function(indexOfFirstSentence, indexOfSecondSentence, value) {
                similarityMatrix[indexOfFirstSentence][indexOfSecondSentence] = value;
                similarityMatrix[indexOfSecondSentence][indexOfFirstSentence] = value;
            };
            
            //This helper method takes two sentences of word objects and returns their similarity.
            var computeSimilarityBetweenSentences = function(firstSentence, secondSentence) {
                var dotProductSum = 0;
                firstSentence.forEach(function(currentFirstWord) {

                    secondSentence.forEach(function(currentSecondWord) {

                        if (currentFirstWord.string === currentSecondWord.string) {
                            dotProductSum += currentFirstWord.weight * currentSecondWord.weight;
                        }

                    });

                });

                if ((firstSentence.magnitude === 0) || (secondSentence.magnitude === 0)) {
                    return 0;
                }
                return (dotProductSum / (firstSentence.magnitude * secondSentence.magnitude));

            };
            
            compoundArrayOfSentences.forEach(function(currentSentence, currentSentenceIndex) {
                for (var otherSentenceIndex = currentSentenceIndex+1; otherSentenceIndex < compoundArrayOfSentences.length; otherSentenceIndex++) {
                    updateSimilarityMatrix(currentSentenceIndex, otherSentenceIndex, computeSimilarityBetweenSentences(currentSentence, compoundArrayOfSentences[otherSentenceIndex]));
                }
            });
        };
        
        //This takes the compound array and attaches to each sentence its pagerank.
        //It returns nothing. It uses helper function sumOfColumn
        var computePageRanks = function(compoundArrayOfSentences) {
            
            //This helper method takes a column in the similarity matrix and returns
            //the sum of that column minus the entry on the diagonal.
            var sumOfColumn = function(columnIndex) {
                //Note that this variable sumOfColumn in defined with a 'var' keyword here.
                //This is CRUCIAL, since it will otherwise destroy the function because
                //they share a name.
                var sumOfColumn = 0;
                for (var rowIndex = 0; rowIndex < similarityMatrix.length; rowIndex++) {
                    sumOfColumn += similarityMatrix[rowIndex][columnIndex];
                }
                sumOfColumn -= similarityMatrix[columnIndex][columnIndex];
                return sumOfColumn;
            };
            
            compoundArrayOfSentences.forEach(function(currentSentence, currentSentenceIndex) {
                for (var compareToIndex = 0; compareToIndex < compoundArrayOfSentences.length; compareToIndex++) {
                    if (currentSentenceIndex !== compareToIndex) {
                        currentSentence.pageRank += similarityMatrix[currentSentenceIndex][compareToIndex]/sumOfColumn(compareToIndex);
                    }
                }
            });
        };
        
        //The top level algorithm function which invokes all the helper methods.
        //Take a compound array of sentences and returns same array.
        var analyzeSentences = function(compoundArrayOfSentences) {
            
            //initialize similarity matrix
            initializeSimilarityMatrix(compoundArrayOfSentences.length);
            
            //perform frequency calculations
            computeFrequencies(compoundArrayOfSentences);
            
            //compute weights
            computeWeights(compoundArrayOfSentences);
            
            //compute sentence magnitude
            computeMagnitudes(compoundArrayOfSentences);
            
            //fill in similarity matrix
            computeSimilarityMatrix(compoundArrayOfSentences);
            
            //pagerank sentences
            computePageRanks(compoundArrayOfSentences);
            
            return compoundArrayOfSentences;
            
        };
        
        return analyzeSentences;
        
    }
    
};