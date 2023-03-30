import { api, LightningElement } from 'lwc';
import getSearchRelated from '@salesforce/apex/ContactController.getSearchRelated';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class GlobalSearch extends LightningElement {

    searchKey = '';
    nextRecordValue = 1;
    accountData = [];
    contactData = [];
    error;
    showTab = false;
    finalRecord = [];
    initialRecord = [];
    allRecord;
    count=0;
    iconName='utility:arrowdown';
    isDisable = true;

    handleKeyChange(event){
        this.isDisable = false
        this.searchKey = event.target.value;
        console.log("searchkey++++++++ ", this.searchKey);
    }
    handleSearch(){
        if(this.searchKey.length > 1){
            this.showTab = true;

        }
        getSearchRelated({searchTerm : this.searchKey})
        .then((result)=>{
            this.allRecord = result;
            console.log("result++++++++++ ", this.allRecord);
            this.accountData =  result.Account;
            console.log("++++++actData+++++++ ", this.accountData);
            this.contactData =  result.Contact;
            console.log("++++++cntctData+++++++ ", this.contactData);
            this.finalRecord = this.accountData.concat(this.contactData);
            console.log("+++++finalRecord+++++ ", this.finalRecord);
            this.initialRecord = this.finalRecord.slice(this.count, 4);
            console.log("+++++count35+++++ ",this.count);
          
            console.log("+++++finalRecord+++++ ", this.initialRecord);
            this.error = undefined;

        })
        .catch((error)=>{
            this.error = error; 
            console.log("error+++++++++++ ", JSON.stringify(this.error));
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Please enter more than one character to search',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            this.recordData  = undefined;
        })
    }

    handleMoreRecord(){
        this.count=this.count+4;
        console.log("+++++count+++++ ",this.count);
        var records =this.finalRecord.slice(this.count, this.count+2); 
        console.log("++++++55+++++++++++ ",this.finalRecord.slice(this.count, this.count+4));
        this.initialRecord = [...this.initialRecord , ...records]; 
        console.log("+++++initialrecord+++++++++ ", this.initialRecord);
        // this.count=this.count+2;

        // this.initialRecord = this.finalRecord;
    }

    sortByName(){
        // sort by name
        this.initialRecord.sort((a, b) => { 
        const nameA = a.Name.toUpperCase(); // ignore upper and lowercase
        console.log("+++++nameA+++++++++ ", nameA);
        const nameB = b.Name.toUpperCase(); // ignore upper and lowercase
        console.log("+++++nameB+++++++++ ", nameB);
        if(this.iconName ==='utility:arrowup'){
            console.log("+++++up++++++");
            this.iconName='utility:arrowdown';
            if (nameA < nameB) {
                console.log("+++++++++82++++++++++++"); // ascending order
                return -1;

            }
        }
        else if(this.iconName==='utility:arrowdown'){
            console.log("+++++down++++++");
            this.iconName='utility:arrowup';
            if (nameA  > nameB) {
                console.log("+++++++++73++++++++++++"); // descending order
                return 1;
            } 
        }
        return 0;       
        });

    }

}