const { WebcController } = WebCardinal.controllers;


export default class FeedbackController extends WebcController {
    constructor(element, history) {
        super(element, history);

       
        this._attachHandlerGoBack();


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }

}