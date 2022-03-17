import { LightningElement,api} from 'lwc';

export default class JobTile extends LightningElement {
    @api job;
    handleOpenRecordClick() {
        const selectEvent = new CustomEvent('jobview', {
            detail: this.job.Id
        });
        this.dispatchEvent(selectEvent);
}

}