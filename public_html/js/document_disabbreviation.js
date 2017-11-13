//This is a module which is used prior to mastication to remove any abbreviations
//which would trip up the masticator. It works off of a predefined list of abbreviations.
//Such is life.
//This is a module which is used prior to mastication to remove any abbreviations
//which would trip up the masticator. It works off of a predefined list of abbreviations.
//Such is life.
DOCUMENT_DISABBREVIATION = {
    
    //Define a closure to return the disabbreviation function.
    retrieveDisabbreviationFunction: function() {
        
        //Private variables should be defined here.
        
        var abbreviations = {
            "number": /No\./gi,
            "rep": /Rep\./gi,
            "us": /U\.S\./gi,
            "col": /Col\./gi,
            "sen": /Sen\./gi,
            "lt": /Lt\./gi,
            "v": /(vs\.)|(v\.)/gi,
            "mr": /Mr\./gi,
            "am": /a\.m\./gi,
            "pm": /p\.m\./gi,
            "january": /jan\./gi,
            "february": /feb\./gi,
            "march": /mar\./gi,
            "april": /apr\./gi,
            "august": /aug\./gi,
            "september": /sept\./gi,
            "october": /oct\./gi,
            "november": /nov\./gi,
            "december": /dec\./gi,
            "": /[A-Z]\.([A-Z]\.)?/g // replace any more remaining two letter abbreviations with nothing (names)
        };
        
        //Takes a documentString and returns the document with the abbreviations replaced
        //with friendly terms.
        var disabbreviate = function(documentString) {
            
            for (var replacement in abbreviations) {
            	documentString = documentString.replace(abbreviations[replacement], replacement);
            }
            
            return documentString;
            
        };
        
        return disabbreviate;
        
    }
    
};
