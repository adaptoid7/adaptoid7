import { LightningElement,api,wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

const NAME_FIELD = 'Job__c.Name';
const LOCATION_LATITUDE_FIELD = 'Job__c.Job_Location__Latitude__s';
const LOCATION_LONGITUDE_FIELD = 'Job__c.Job_Location__Longitude__s';

const jobFields=[NAME_FIELD,
	LOCATION_LATITUDE_FIELD,
	LOCATION_LONGITUDE_FIELD];

export default class JobLocation extends LightningElement {
    @api recordId;
    name;
    mapMarkers = [];
    @wire(getRecord,{recordId:'$recordId',fields:jobFields })
    loadJob({data,error}){
        if(data){
            this.name =  getFieldValue(data, NAME_FIELD);
            const Latitude = getFieldValue(data, LOCATION_LATITUDE_FIELD);
            const Longitude = getFieldValue(data, LOCATION_LONGITUDE_FIELD);
            if(Latitude>27.385 && Latitude<27.837){
                if(Longitude>85.127 && Longitude<85.637){
                    this.mapMarkers =[{
                        location: {Latitude,Longitude},
                        title: this.name,
                        description: `Coords: ${Latitude}, ${Longitude}`
                    }]
                }    
            }
            else{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Please Enter the Location Within Kathmandu',
                         mode: 'dismissible',
                        variant: 'error'
                    })  
                );
            }        
        }
                      
            else if(error){
                this.error = undefined;
            }  
    }         
     get cardTitle() {
        return (this.name) ? `${this.name}'s location` : 'Job location';
  }

}