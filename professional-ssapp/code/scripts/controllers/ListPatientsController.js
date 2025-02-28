const {WebcController} = WebCardinal.controllers;
import { participantsService } from '../services/participants.service.js';


export default class ListPatientsController extends WebcController {
  constructor(element, history) {
    super(element, history);
    this.model =  {
      trials: {
        label: 'Select a trial',
        placeholder: 'Please select an option',
        required: false,
        options: [],
      },
      participants: null,
    };

    this.participantsService = participantsService;
    this.init();
    this.attachAll();
    //this._attachHandlerPatientStatus();
    
  }

  async init() {
    try {
      this.model.trials.options = (await this.participantsService.getTrials()).map((trial) => ({
        label: trial.name,
        value: trial.id,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  attachAll() {
    this.model.addExpression(
      'trialsNotEmpty',
      () => {
        return (
          this.model.trials.options && Array.isArray(this.model.trials.options) && this.model.trials.options.length > 0
        );
      },
      'trials'
    );

    this.model.addExpression(
      'participantsNotEmpty',
      () => {
        return this.model.participants && Array.isArray(this.model.participants) && this.model.participants.length > 0;
      },
      'participants'
    );

    this.on('go-back', async (event) => {
      this.navigateToPageTag('home', event.data);
    });
   
    this.on('patient-status',  (event) => {
        console.log ("Patient Status button pressed");
        this.navigateToPageTag('patient-status');
    });
    this.on('trial-select', async (event) => {
      try {
        this.model.participants = (
          await this.participantsService.getTrialParticipants(parseInt(this.model.trials.value))
        ).map((participant) => ({
          ...participant,
        }));

        console.log(this.model.participants);
      } catch (error) {
        console.log(error);
      }
    });
    
  }
}
