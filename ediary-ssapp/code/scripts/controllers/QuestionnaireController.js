import QuestionnaireService from "../services/QuestionnaireService.js";
import QuestionnaireResponse from "../models/QuestionnaireResponse.js";
import ResponsesService from "../services/ResponsesService.js";
import CommunicationService from '../services/CommunicationService.js';

const {WebcController} = WebCardinal.controllers;

const getInitModel = () => {
    return {
        votingOpen: true,
        questionnairesTabNavigator: {
            selected: 0
        },
        questions: [],
        buttonsState: {
            showLeft: false,
            showRight: true,
            showFeedback: false
        }
    };
}

const TAB_MIN_VALUE = 0;
let TAB_MAX_VALUE = 0;

export default class QuestionnaireController extends WebcController {
    constructor(...props) {
        super(...props);

        this.setModel(getInitModel());

        this.tabsContainer = this.querySelector('#tabs-container');
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.EDIARY_IDENTITY);
        this.QuestionnaireService = new QuestionnaireService(this.DSUStorage);
        this.ResponsesService = new ResponsesService(this.DSUStorage);

        this.updateQuestionnaire();

        this.onTagClick('prev', (event) => {
            let currentIndexSelected = this.model.questionnairesTabNavigator.selected;
            if (currentIndexSelected > TAB_MIN_VALUE) {
                this.model.questionnairesTabNavigator.selected = currentIndexSelected - 1;
            }
            this.computeButtonStates();
        });

        this.onTagClick('next', (event) => {
            let currentIndexSelected = this.model.questionnairesTabNavigator.selected;
            if (currentIndexSelected < TAB_MAX_VALUE) {
                this.model.questionnairesTabNavigator.selected = currentIndexSelected + 1;
            }
            this.computeButtonStates();
        });

        this.onTagClick('send-feedback', (event) => {
            this.model.questions = this.model.questions.map(question => {
                return {
                    ...question,
                    response: this.querySelector(`input[name="${question.name}"]:checked`).value
                }
            })
            this.model.votingOpen = false;
        });

        this.onTagClick('finish-questionnaire', (event) => {
            let questionTemplate = QuestionnaireResponse.example;
            questionTemplate.item = this.model.questions.map((question) => {
                return {
                    linkId: question.name,
                    text: question.title,
                    answer: [
                        {
                            valueCoding: {
                                code: question.response
                            }
                        }
                    ],
                }
            });
            this.ResponsesService.saveResponse(questionTemplate, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                this.sendMessageToProfessional('questionnaire-response', data.uid);
                this.ResponsesService.getResponses((err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    data.forEach(response => {
                        response.item.forEach(item => {
                            //console.log(item.answer[0], item.linkId, item.text)
                        })
                    })
                })
            });
            this.model.questions.forEach(question => console.log(question.id, question.response, question.title))
            this.navigateToPageTag('home');
        });
    }

    updateQuestionnaire() {
        this.QuestionnaireService.getQuestionnaires((err, data) => {
            if (err) {
                return console.log(err);
            }
            let questionnaire = data[0];
            let items = questionnaire.item.filter(item => item.type === 'choice');
            let questions = [];
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let answers = item.answerOption.map(answer => {
                    return {
                        id: answer.valueCoding.code,
                        label: answer.valueCoding.code,
                        name: item.linkId
                    };
                })
                questions.push({
                    id: i,
                    name: item.linkId,
                    title: item.text,
                    response: -1,
                    answers: answers
                })
            }
            this.model.questions = questions;
            this.querySelector('#tabs-container').innerHTML = `<webc-template template="questionnaire-template" data-view-model="@"></webc-template>`
            TAB_MAX_VALUE = questions.length;
        })
    }

    sendMessageToProfessional(operation, ssi) {
        this.CommunicationService.sendMessage(CommunicationService.identities.PROFESSIONAL_IDENTITY, {
            operation: operation,
            ssi: ssi
        });
    }

    computeButtonStates() {
        this.model.buttonsState.showLeft = this.model.questionnairesTabNavigator.selected > 0;
        this.model.buttonsState.showRight = this.model.questionnairesTabNavigator.selected < TAB_MAX_VALUE - 1;

        if (this.model.questionnairesTabNavigator.selected === TAB_MAX_VALUE - 1) {
            this.model.buttonsState.showLeft = false;
            this.model.buttonsState.showRight = false;
            this.model.buttonsState.showFeedback = true;
        }
    }

}
