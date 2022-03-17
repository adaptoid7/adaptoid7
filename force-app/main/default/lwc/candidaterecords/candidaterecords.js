import { LightningElement, wire} from 'lwc';
import DEGREE__c_FIELD from '@salesforce/schema/Education_Detail__c.Degree__c';
import INSTITUTION__c_FIELD from '@salesforce/schema/Education_Detail__c.Institution__c';
import START_DATE__c_FIELD from '@salesforce/schema/Education_Detail__c.Start_Date__c';
import END_DATE__c_FIELD from '@salesforce/schema/Education_Detail__c.End_Date__c';
import getEducationDetail from '@salesforce/apex/EducationDetailController.getEducationDetail';
import getApplciantId from '@salesforce/apex/ExperienceDetailController.getApplciantId';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {updateRecord,deleteRecord } from 'lightning/uiRecordApi';

import APPLICANT__c_NAME from '@salesforce/schema/Applicant__c.Name';
import JOB_TYPE__c_FIELD from '@salesforce/schema/Experience_Detail__c.Job_Type__c';
import COMPANY_NAME__c_FIELD from '@salesforce/schema/Experience_Detail__c.Company_Name__c';
import STARTDATE__c_FIELD from '@salesforce/schema/Experience_Detail__c.Start_Date__c';
import ENDDATE__c_FIELD from '@salesforce/schema/Experience_Detail__c.End_Date__c';
import PERIOD__c_FIELD from '@salesforce/schema/Experience_Detail__c.Period__c';
import getExperienceDetail from '@salesforce/apex/ExperienceDetailController.getExperienceDetail';
import { NavigationMixin } from 'lightning/navigation';


const appfield=[APPLICANT__c_NAME];

  const actions = [
         { label: 'Delete', name: 'delete' }];

  const columns=[{label:'Degree',fieldName:DEGREE__c_FIELD.fieldApiName, type:'text',editable: true},
             {label:'Institution',fieldName:INSTITUTION__c_FIELD.fieldApiName,type:'text',editable: true},
             {label:'Start Date',fieldName:START_DATE__c_FIELD.fieldApiName,type:'date',editable: true},
             {label:'End Date',fieldName:END_DATE__c_FIELD.fieldApiName,type:'date',editable: true},
             { type: 'action',typeAttributes : {rowActions : actions}},  ];

   const COLUMN=[{label:'Job Type',fieldName:JOB_TYPE__c_FIELD.fieldApiName, type:'text',editable: true},
             {label:'Company Name',fieldName:COMPANY_NAME__c_FIELD.fieldApiName,type:'text',editable: true},
             {label:'Start Date',fieldName:STARTDATE__c_FIELD.fieldApiName,type:'date',editable: true},
             {label:'End Date',fieldName:ENDDATE__c_FIELD.fieldApiName,type:'date',editable: true},
             {label:'Period(Years)',fieldName:PERIOD__c_FIELD.fieldApiName,type:'number'},
             { type: 'action',typeAttributes : {rowActions : actions}}, ];
                       
             

export default class Candidaterecords extends NavigationMixin(LightningElement) {

    appId;
    eduId;
    expId;
    columns = columns;
    column = COLUMN;
    education = [];
    experience = [];
    AppID =[];
    error;
    count = 0;
  
   addExperience(){
        getExperienceDetail({ appId : this.appId })
       .then((result)=>{
           this.experience = result;
           this.error = undefined;
       })
       .catch((error)=>{
           this.error = error;
           this.experience = undefined;
       }
       )      
   }
     

   gotostepTwo(){
       this.template.querySelector('div.stepOne').classList.add('slds-hide');
       this.template.querySelector('div.stepTwo').classList.remove('slds-hide');
       this.template.querySelector('div.stepThree').classList.add('slds-hide');
          
   }
   gotostepThree(){
       this.template.querySelector('div.stepTwo').classList.add('slds-hide');
       this.template.querySelector('div.stepThree').classList.remove('slds-hide');
   }

   gotostepOne(){
       this.template.querySelector('div.stepTwo').classList.add('slds-hide');
       this.template.querySelector('div.stepThree').classList.add('slds-hide');
       this.template.querySelector('div.stepOne').classList.remove('slds-hide'); 
    }
    gobacktostepTwo(){
        this.template.querySelector('div.stepThree').classList.add('slds-hide');
        this.template.querySelector('div.stepTwo').classList.remove('slds-hide');
    }

    handleError(event) {
        event.preventDefault();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: event.detail,
                variant: 'error'
                })
            );
    
    }  

    handleKey(event){
        event.currentTarget.reportValidity();
    }

    handleSuccess(event){
        let recordId = event.detail.id;
        this.appId = recordId; 

         if(this.count == 0){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'New Personal Information Created',
                    variant: 'success'
                })
            );
            
        }
        else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: ' Personal Information Updated',
                    variant: 'success'
                })
            );
        }
       this.count = this.count + 1;
    }
            
    
    handleSuccessEvent(event){
        let recordId = event.detail.id;
        this.eduId = recordId;
         this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Education detail created',
                        variant: 'success'
                    })
                );

        getEducationDetail({ appId : this.appId })
        .then((result)=>{ 
           this.education = result;
           this.error=  undefined;
       })
       .catch((error)=>{    
            this.error = error;
            this.education = undefined;
        }
       )     

        const inputFields = this.template.querySelectorAll('.reset');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handlesuccessExp(event){
        let recordId = event.detail.id;
        this.expId = recordId;
        this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Experience detail created',
                        variant: 'success'
                    })
                );
       

        getExperienceDetail({ appId : this.appId })
       .then((result)=>{ 
           this.experience = result;
           this.error=  undefined;
       })
       .catch((error)=>{
           this.error = error;
           this.experience = undefined;
       }
       )     
       
        const inputFields = this.template.querySelectorAll('.reset-Exp');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handleSave(event) {
        
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
            Promise.all(promises).then(education => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Education detail updated',
                        variant: 'success'
                    })
                );
                this.draftValues = [];  
                return refreshApex(education);
              
            }).catch(error => {
                this.error = error;
                this.education = undefined;
              });
    }
    handleSaveExp(event){
         const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
            Promise.all(promises).then(experience => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Experience detail updated',
                        variant: 'success'
                    })
                );
                this.draftValues = [];  
                return refreshApex(experience);
              
            }).catch(error => {
                this.error = error;
                this.education = undefined;
              });
    }

    handleRowAction(event) {
        //const action = event.detail.action;
        const row = event.detail.row;
        this.eduId = row.Id;
            
        deleteRecord(this.eduId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })  
                );
                getEducationDetail({ appId : this.appId })
                    .then((result)=>{ 
                        this.education = result;
                        this.error=  undefined;
                    })
                    .catch((error)=>{    
                        this.error = error;
                        this.education = undefined;
                    }
                )             
            })
        .catch((error)=>{
            this.error = error;
            this.education = undefined;
        })                             
    }

    handleRowActionExp(event){
         const row = event.detail.row;
        this.expId = row.Id;
            
        deleteRecord(this.expId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })  
                );
                getExperienceDetail({ appId : this.appId })
                    .then((result)=>{ 
                        this.experience = result;
                        this.error=  undefined;
                    })
                    .catch((error)=>{    
                        this.error = error;
                        this.education = undefined;
                    }
                )             
            })
        .catch((error)=>{
            this.error = error;
            this.education = undefined;
        })                             

    }

    exitForm(){
        
        if(this.appId == null){
            this.dispatchEvent(
                new ShowToastEvent({
                        title: 'Error',
                        message: 'Please! Enter Personal Details',
                        variant: 'Error'
                    })  
                );
            this.gotostepOne();        
           
        }
        else if(this.eduId == null){
            this.dispatchEvent(
                new ShowToastEvent({
                        title: 'Error',
                        message: 'Please! Enter Education Details',
                        variant: 'Error'
                    })  
                );
            this.gotostepTwo();    

        }
        else{
            getApplciantId({ appId : this.appId })
            .then((result)=>{ 
                this.AppID = result;
                debugger;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Info',
                        message: 'Your Applicant id is '+ this.AppID[0].Name,
                        mode: 'dismissible',
                        variant: 'info'
                    })  
                );
            })
            .catch((error)=>{
                this.error = error;
            }
            )

        this[NavigationMixin.Navigate]({
           type: 'standard__namedPage',
           attributes: {
               pageName: 'home'
               
           },
       });   


          
        }
    }
         
}