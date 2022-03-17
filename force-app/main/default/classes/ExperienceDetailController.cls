public with sharing class ExperienceDetailController {  
    @AuraEnabled
    public static List<Experience_Detail__c> getExperienceDetail(id appId) {
        return [SELECT  Job_Type__c, Company_Name__c, End_Date__c, Start_Date__c, Period__c FROM Experience_Detail__c WHERE Applicant__c = :appId];

    }
     @AuraEnabled
    public static List<Applicant__c> getApplciantId(id appId){
        return [SELECT  Name FROM Applicant__c WHERE Id = :appId];
    }

}