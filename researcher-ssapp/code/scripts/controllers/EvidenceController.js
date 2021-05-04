import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';

const AddDevicesViewModel = {
    name: {
        name: 'name',
        label: "Name",
        placeholder: 'Name',
        required: true,
        readOnly: false,
        value: ''
    },
    organization: {
        name: 'organization',
        label: "Organization",
        placeholder: 'Organization',
        required: true,
        readOnly: false,
        value: ''
    },
    email: {
        name: 'email',
        label: "Email",
        placeholder: 'Email',
        required: true,
        readOnly: false,
        value: ''
    },
    title: {
        name: 'title',
        label: "Title",
        placeholder: 'Title',
        required: true,
        readOnly: false,
        value: ''
    },
    subtitle: {
        name: 'subtitile',
        label: "Subtitle",
        placeholder: 'Subtitle',
        required: true,
        readOnly: false,
        value: ''
    },
    version: {
        name: 'version',
        label: "Version",
        placeholder: 'Version',
        required: true,
        readOnly: false,
        value: ''
    },
    description: {
        
        name: 'description',
        label: "Description",
        placeholder: 'Description of the evidence',
        required: true,
        value: ''
    },
    saveButton: {
        name: 'saveButton',
        label: "Save",
        required: true,
        readOnly: false,
        value: ''
    },
    gobackButton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    }
}

export default class EvidenceController extends ContainerController {
    constructor(element, history) {

        super(element, history);
        this.model = this.setModel(JSON.parse(JSON.stringify(AddDevicesViewModel)));
        this._attachHandlerEvidenceP1()
        this._attachHandlerEvidenceP2()
        this._attachHandlerEvidenceP3()
        this._attachHandlerEvidenceBackMenu()
        this._attachHandlerEvidenceConfirm()
        this._attachHandlerEvidence()
        this._attachHandlerEvidenceList()
        this._attachHandlerHome()
        this._attachHandlerEvidenceEdit()
    }
    
    _attachHandlerHome(){
        this.on('evidence:home', (event) => {
            this.History.navigateToPageByTag('home');
        });
    }
    _attachHandlerEvidence(){
        this.on('evidence:evidence', (event) => {
            this.History.navigateToPageByTag('evidence');
        });
    }
    _attachHandlerEvidenceList(){
        this.on('evidence:list', (event) => {
            this.History.navigateToPageByTag('evidence-list');
        });
    }
    _attachHandlerEvidenceP1(){
        this.on('evidence:add-evidence-p1', (event) => {
            this.History.navigateToPageByTag('add-evidence-p1');
        });
    }
    _attachHandlerEvidenceP2(){
        this.on('evidence:add-evidence-p2', (event) => {
            this.History.navigateToPageByTag('add-evidence-p2');
        });
    }
    _attachHandlerEvidenceP3(){
        this.on('evidence:add-evidence-p3', (event) => {
            this.History.navigateToPageByTag('add-evidence-p3');
        });
    }
    _attachHandlerEvidenceConfirm(){
        this.on('evidence:confirm', (event) => {
            this.History.navigateToPageByTag('confirm-evidence');
        });
    }
    _attachHandlerEvidenceEdit(){
        this.on('evidence:edit', (event) => {
            this.History.navigateToPageByTag('edit-evidence');
        });
    }
    _attachHandlerEvidenceBackMenu(){
        this.on('evidence:back-to-menu', (event) => {
            this.History.navigateToPageByTag('evidence');
        });
    }
}
