public with sharing class EducationDetailController {
     @AuraEnabled
    public static List<Education_Detail__c> getEducationDetail(id appId) {
        return [SELECT  Degree__c, Institution__c, Start_Date__c, End_Date__c FROM Education_Detail__c WHERE Applicant__c = :appId];

    }

    @AuraEnabled(cacheable=true)
    public static String deleteEducation(id eduId) {
    
        Education_Detail__c[] eduList = [SELECT  Degree__c, Institution__c, Start_Date__c, End_Date__c FROM Education_Detail__c  WHERE Id = :eduId];   
        delete eduList;
        return 'Record Sucessfully deleted';
        
    }
}