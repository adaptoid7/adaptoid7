public with sharing class JobListController {
    @AuraEnabled(Cacheable=true)
    public static List<Job__c> getAllJobs() {
        return[SELECT Name, Company_Name__c, Creation_Date__c, Expiry_Date__c, Job_Description__c, Job_Type__c,  Job_Position__c , Number_of_Vacc__c, Validity_Period_Days__c, Validity__c 
            FROM Job__c WHERE Validity__c = 'Active'];

    }


    @AuraEnabled(Cacheable=true)
    public static List<Job__c> searchJobs(String searchTerm) {
        searchTerm = searchTerm.trim();
        if (searchTerm == '') {
            return getAllJobs();
        }
        searchTerm = '%' + searchTerm + '%';
        return [
            SELECT Name, Company_Name__c, Job_Type__c,  Job_Position__c , Number_of_Vacc__c
             FROM Job__c WHERE Validity__c = 'Active' AND Job_Type__c LIKE :searchTerm
            ORDER BY Name ASC
            LIMIT 50
        ];
    }
}    