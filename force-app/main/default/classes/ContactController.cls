public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        try {
            return [SELECT Id, Name,
             FirstName,
             LastName,
             Title,
             Phone,
             Email 
             FROM Contact LIMIT 10];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String searchKey){
        try {
            String key = '%' + searchKey + '%';
            return [SELECT Id,
             FirstName,
             LastName,
             Phone,
             Email 
             FROM Contact WHERE Name LIKE:key LIMIT 5];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Contact getSingleContact(){
        try {
             return [SELECT Id, Name,
             FirstName,
             LastName,
             Title,
             Phone,
             Email 
             FROM Contact  WITH SECURITY_ENFORCED LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> deleteContact(String accId){
        return [SELECT Id, LastName FROM Contact WHERE AccountId =: accId];
    }

    Public class WraperForStorage{  
        @AuraEnabled Public List<Account> Account {get;set;}  
        @AuraEnabled Public List<Contact> Contact {get;set;}  
    }   
    
    @AuraEnabled  
    Public static WraperForStorage getSearchRelated(String searchTerm){  
        WraperForStorage wrperObj = new WraperForStorage();
        String searchQuery = 'FIND \'' + searchTerm + '\'  IN ALL FIELDS RETURNING Account(NAME, Email__c, Phone WHERE NAME Like  \'%' + searchTerm + '%\' LIMIT 5), Contact(Name, FIRSTNAME, LASTNAME, Email, Phone WHERE LASTNAME Like  \'%' + searchTerm + '%\' LIMIT 5)';
        list<list<Sobject>> totalResults = search.query(searchQuery);  
        System.debug('totalResults+++++ ' + totalResults);
        System.debug('searchTerm+++++++++++ ' + searchTerm);
        Account[] accList = (Account[])totalResults[0];  
        Contact[] conList = (Contact[])totalResults[1];  
        wrperObj.Account = accList;  
        wrperObj.Contact = conList;  

      System.debug('wrperObj+++++ ' + wrperObj);
      return wrperObj;   
    }   
}