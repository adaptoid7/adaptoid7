trigger JobApplicationDuplication on Job_Application__c (before insert) {
    List<Job_Application__c> dup = new List<Job_Application__c>(); 
    Set <String> newApplicantSet = new Set<String>();
    Set<String> newJobSet = new Set<String>();
    Set <String> existingApplicantSet = new Set<String>();
    Set<String> existingJobSet = new Set<String>();
    dup= Trigger.New;
   	
    for(Job_Application__c jobAp : dup){
        if(jobAP.Applicant__c != null){
            newApplicantSet.add(jobAp.Applicant__c);
        }
        if(jobAP.Job__c != null){
            newJobSet.add(jobAp.Job__c);
        }
    }
	List<Job_Application__c> existingjobApp = [SELECT Id, Applicant__c, Job__c FROM Job_Application__c WHERE Applicant__c = :newApplicantSet AND Job__c = :newJobSet ];
    
    for(Job_Application__c jobAp : existingjobApp ){
        existingApplicantSet.add(jobAp.Applicant__c);
        existingJobSet.add(jobAp.Job__c);
    }
    for(Job_Application__c jobAP : dup){
        if(existingApplicantSet.contains(jobAp.Applicant__c) && existingJobSet.contains(jobAP.Job__c)){
            jobAP.Applicant__c.AddError('Already applied for the job');
        }
    }
}