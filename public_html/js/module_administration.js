EXECUTIVE = {
    administer: function(documentString, percentage) {
        var disabbreviatedString = DOCUMENT_DISABBREVIATION.retrieveDisabbreviationFunction()(documentString);
        var simpleSentenceArray = DOCUMENT_MASTICATION.retrieveDocumentMasticationFunction()(disabbreviatedString);
        var compoundSentenceArray = SENTENCE_PARSING.retrieveSentenceParsingFunction()(simpleSentenceArray);
        var analyzedArray = SENTENCE_ANALYSIS.retrieveSentenceAnalysisAlgorithm()(compoundSentenceArray);
        var reorderedSentences = SENTENCE_REORDERING.retrieveSentenceReorderingFunction()(analyzedArray);
        return SENTENCE_RECONSTITUTION.retrieveSentenceReconstitutionFunction()(reorderedSentences, percentage/100);
    }
};