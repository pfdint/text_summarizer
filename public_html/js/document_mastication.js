//This module is for breaking the document String into an array of sentences,
//where block quotations are one sentence. The document must be disabbreviated.
DOCUMENT_MASTICATION = {
    
    //Define a closure to return the mastication function.
    retrieveDocumentMasticationFunction: function() {
        
        //Private members should be defined here.
        
        //This is the shared stack onto which states may store partial or full
        //sentences for reconsitution before injection into the grand array.
        var sentenceStack = [];
        
        //This is the array which will be returned by the mastication function.
        //It contains all the sentences in string form.
        var sentenceArray = [];
        
        //This is the regex by which we find sentence terminators.
        var sentenceTerminators = /\.|!|\?|"/g;
        
        var normalSentenceState = function(documentString, startIndex, foundIndex) {
            if (documentString.charAt(foundIndex) === '"') {
                sentenceStack.push(documentString.substring(startIndex + 1, foundIndex));
                state = partialQuotationState;
            } else {
                sentenceStack.push(documentString.substring(startIndex + 1, foundIndex + 1));
                sentenceArray.push(sentenceStack.join(""));
                sentenceStack.length = 0;
            }
        };
        
        var partialQuotationState = function(documentString, startIndex, foundIndex) {
            if (documentString.charAt(foundIndex) === '"') {
            	sentenceStack.push(documentString.substring(startIndex, foundIndex + 1));
                state = normalSentenceState;
            } else {
            	sentenceStack.push(documentString.substring(startIndex, foundIndex));
                state = blockQuotationState;
            }
        };
        
        var blockQuotationState = function(documentString, startIndex, foundIndex) {
            if (documentString.charAt(foundIndex) === '"') {
                sentenceStack.push(documentString.substring(startIndex, foundIndex + 1));
                sentenceArray.push(sentenceStack.join(""));
                sentenceStack.length = 0;
                state = normalSentenceState;
            } else {
                sentenceStack.push(documentString.substring(startIndex, foundIndex));
            }
        };
        
        //This sets the original state of the parser.
        var state = normalSentenceState;
        
        var masticateDocument = function(documentString) {
            
            //This augmentation on String takes a regex and optional start position,
            //and searches for the next instance of the regex after the start position.
            //It returns the index of the occurence in the String.
            String.prototype.regexIndexOf = function(regex, startPosition) {
                var indexOf = this.substring(startPosition || 0).search(regex);
                return (indexOf >= 0) ? (indexOf + (startPosition || 0)) : indexOf;
            };
            
            documentString = documentString.replace(/-\n/g, "");
            
            documentString = documentString.replace(/\n/g, " ");
            
            sentenceStack.push(documentString.substr(0,1));
            
            var previousSentenceTerminatorIndex = 0;
            var nextSentenceTerminatorIndex = documentString.search(sentenceTerminators);
            
            while (nextSentenceTerminatorIndex !== -1) {
                state(documentString, previousSentenceTerminatorIndex, nextSentenceTerminatorIndex);
                previousSentenceTerminatorIndex = nextSentenceTerminatorIndex;
                nextSentenceTerminatorIndex = documentString.regexIndexOf(sentenceTerminators, nextSentenceTerminatorIndex + 1);
            }
            
            return sentenceArray;
            
        };
        
        return masticateDocument;
        
    }
    
};
////This is good testing code.
//var doc = 'This is a "test" string. It contains, "partial quotations concerning nothing." It is very dumb. "But it helps us test. And what more is there?" That\'s all.';
//var masticateDocument = DOCUMENT_MASTICATION.retrieveDocumentMasticationFunction();
//var resultingArray = masticateDocument(doc);
//resultingArray.forEach(function(sentence, sentenceNumber) {
//	document.write(sentence + "==============");
//});