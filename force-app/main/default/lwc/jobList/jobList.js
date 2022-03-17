import { LightningElement, wire } from 'lwc';
import searchJobs from '@salesforce/apex/JobListController.searchJobs';
import { NavigationMixin } from 'lightning/navigation'; 

export default class JobList extends  NavigationMixin(LightningElement) {
    jobs;
    error;
    searchTerm ='';

    @wire(searchJobs,{searchTerm: '$searchTerm'})
    jobs;

    handleSearchTermChange(event){
        window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
    }
    get hasResults(){
        return (this.jobs.data.length > 0);
    }

    handleJobView(event){
        const jobId = event.detail;
        this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: jobId,
				objectApiName: 'Job__c',
				actionName: 'view',
			},
		});
	}


}    
