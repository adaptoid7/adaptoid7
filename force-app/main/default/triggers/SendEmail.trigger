trigger SendEmail on Job_Application__c (after update) {
    Applicant__c app = new Applicant__c ();
    List<Messaging.SingleEmailMessage> mails =
  		new List<Messaging.SingleEmailMessage>();
    for(Job_Application__c jobap : Trigger.New){
         
        if(jobap.Status__c == 'Submitted' &&  jobap.Status__c != Trigger.oldMap.get(jobap.Id).Status__c){
            app =[SELECT Id,Email__c,First_Name__c FROM Applicant__c WHERE id =:jobap.Applicant__c ];
            system.debug(app + 'hello');
            Messaging.SingleEmailMessage mail =  new Messaging.SingleEmailMessage();
            List<String> sendTo = new List<String>();        
            sendTo.add(app.Email__c);
           	mail.setToAddresses(sendTo);
            mail.setSubject('Subject Content');
            String body = 'Dear ' + app.First_Name__c + ', ';
      		body += 'Your Application has been approved';
            mail.setHtmlBody(body);
            
            mails.add(mail);          
        }
    }
    Messaging.sendEmail(mails);
}