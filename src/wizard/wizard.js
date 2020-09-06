class Steps {
    constructor(wizard) {
        this.wizard = wizard;
        this.steps = this.getSteps();
        this.stepsQuantity = this.getStepsQuantity();
        this.currentStep = 0;
    }

    setCurrentStep(currentStep) {
        this.currentStep = currentStep;
    }

    getSteps() {
        return this.wizard.getElementsByClassName('step');
    }

    getStepsQuantity() {
        return this.getSteps().length;
    }

    handleConcludeStep() {
        this.steps[this.currentStep].classList.add('-completed');
    }

    handleStepsClasses(movement) {
        if (movement > 0)
            this.steps[this.currentStep - 1].classList.add('-completed'); else if (movement < 0)
            this.steps[this.currentStep].classList.remove('-completed');
    }
}


class Panels {
    constructor(wizard) {
        this.wizard = wizard;
        this.panelWidth = this.wizard.offsetWidth;
        this.panelsContainer = this.getPanelsContainer();
        this.panels = this.getPanels();
        this.currentStep = 0;

        this.updatePanelsPosition(this.currentStep);
        this.updatePanelsContainerHeight()
    }

    getCurrentPanelHeight() {
        return `${this.getPanels()[this.currentStep].offsetHeight}px`;
    }

    getPanelsContainer() {
        return this.wizard.querySelector('.panels');
    }

    getPanels() {
        return this.wizard.getElementsByClassName('panel');
    }

    updatePanelsContainerHeight() {
        this.panelsContainer.style.height = this.getCurrentPanelHeight();
    }

    updatePanelsPosition(currentStep) {
        const panels = this.panels;
        const panelWidth = this.panelWidth;

        for (let i = 0; i < panels.length; i++) {
            panels[i].classList.remove(
                'movingIn',
                'movingOutBackward',
                'movingOutFoward');


            if (i !== currentStep) {
                if (i < currentStep) panels[i].classList.add('movingOutBackward'); else if (i > currentStep) panels[i].classList.add('movingOutFoward');
            } else {
                panels[i].classList.add('movingIn');
            }
        }

        this.updatePanelsContainerHeight();
    }

    setCurrentStep(currentStep) {
        this.currentStep = currentStep;
        this.updatePanelsPosition(currentStep);
    }
}


class Wizard {
    constructor(obj) {
        this.wizard = obj;
        this.panels = new Panels(this.wizard);
        this.steps = new Steps(this.wizard);
        this.stepsQuantity = this.steps.getStepsQuantity();
        this.currentStep = this.steps.currentStep;

        this.concludeControlMoveStepMethod = this.steps.handleConcludeStep.bind(this.steps);
        this.wizardConclusionMethod = this.handleWizardConclusion.bind(this);
    }

    updateButtonsStatus() {
        if (this.currentStep === 0)
            this.previousControl.classList.add('disabled'); else

            this.previousControl.classList.remove('disabled');
    }

    updtadeCurrentStep(movement) {
        this.currentStep += movement;
        this.steps.setCurrentStep(this.currentStep);
        this.panels.setCurrentStep(this.currentStep);

        this.handleNextStepButton();
        this.updateButtonsStatus();
    }

    handleNextStepButton() {
        if (this.currentStep === this.stepsQuantity - 1) {
            this.nextControl.innerHTML = chrome.i18n.getMessage("w53");

            this.nextControl.removeEventListener('click', this.nextControlMoveStepMethod);
            this.nextControl.addEventListener('click', this.concludeControlMoveStepMethod);
            this.nextControl.addEventListener('click', this.wizardConclusionMethod);
        } else {
            this.nextControl.innerHTML = chrome.i18n.getMessage("w48");

            this.nextControl.addEventListener('click', this.nextControlMoveStepMethod);
            this.nextControl.removeEventListener('click', this.concludeControlMoveStepMethod);
            this.nextControl.removeEventListener('click', this.wizardConclusionMethod);
        }
    }

    handleWizardConclusion() {
        w49.style.display = ""
        this.wizard.classList.add('completed');
        setTimeout(function () {
            window.open("https://www.youtube.com", "_self")
        }, 5000);
    }

    addControls(previousControl, nextControl) {
        this.previousControl = previousControl;
        this.nextControl = nextControl;
        this.previousControlMoveStepMethod = this.moveStep.bind(this, -1);
        this.nextControlMoveStepMethod = this.moveStep.bind(this, 1);

        previousControl.addEventListener('click', this.previousControlMoveStepMethod);
        nextControl.addEventListener('click', this.nextControlMoveStepMethod);

        this.updateButtonsStatus();
    }

    moveStep(movement) {
        if (this.validateMovement(movement)) {
            this.updtadeCurrentStep(movement);
            this.steps.handleStepsClasses(movement);
        } else {
            throw 'This was an invalid movement';
        }
    }

    validateMovement(movement) {
        const fowardMov = movement > 0 && this.currentStep < this.stepsQuantity - 1;
        const backMov = movement < 0 && this.currentStep > 0;

        return fowardMov || backMov;
    }
}


let wizardElement = document.getElementById('wizard');
let wizard = new Wizard(wizardElement);
let buttonNext = document.querySelector('.next');
let buttonPrevious = document.querySelector('.previous');

wizard.addControls(buttonPrevious, buttonNext);


// qrlk's govnocode


function selectSide(id) {
    chrome.storage.sync.get(["secret"], function (result) {
            if (result["secret"] != null) {
                $.ajax
                ({
                    url: "https://karma.adwhore.net:47976/switchUserSide",
                    type: "POST",
                    data: JSON.stringify({"secret": result["secret"], "side": id}),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"side": data["side"]});
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            } else {
                $.ajax
                ({
                    url: "https://karma.adwhore.net:47976/addNewUser",
                    type: "POST",
                    data: JSON.stringify({"uuid": result["uuid"]}),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"secret": data["secret"], "name": data["name"], "side": data["side"]});
                        setTimeout(function () {
                            selectSide(id)
                        }, 500);
                        // alert("ADN user registered\n"+JSON.stringify(data));
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            }
        }
    )
}

function updateModesDisplay() {
    document.getElementById(`config1`).style.display = "none"
    document.getElementById(`config2`).style.display = "none"
    document.getElementById(`config3`).style.display = "none"
    document.getElementById(`config4`).style.display = "none"
    document.getElementById(`config5`).style.display = "none"

    document.getElementById(`config${document.getElementById("mode_select").value}`).style.display = ""
    wizard.panels.updatePanelsContainerHeight()
}

wizard.panels.updatePanelsContainerHeight()

mode_select.onchange = function () {
    updateModesDisplay()
    chrome.storage.sync.set({"mode": +mode_select.value});
}

appearenceForm.addEventListener('change', function (evt) {
    let aId = +evt.target.dataset.show
    switch (aId) {
        case 1:
            chrome.storage.sync.set({"show_panel": true, "show_flags": true});
            break;
        case 2:
            chrome.storage.sync.set({"show_panel": true, "show_flags": false});
            break;
        case 3:
            chrome.storage.sync.set({"show_panel": false, "show_flags": false});
            break;
    }
})

const descriptions = {
    1: chrome.i18n.getMessage("w50"),
    2: chrome.i18n.getMessage("w51"),
    3: chrome.i18n.getMessage("w52"),
}

teamsForm.addEventListener('change', function (evt) {
    let descriptionId = evt.target.dataset.show
    selectSide(+descriptionId)
    display.innerHTML = descriptions[descriptionId]
    wizard.panels.updatePanelsContainerHeight()
})

chrome.storage.sync.get(["mode", "show_flags", "show_panel", "side"], function (result) {
    mode_select.value = result["mode"]
    if (!result["show_panel"]) {
        a3.checked = true
    } else {
        if (result["show_flags"]) {
            a1.checked = true
        } else {
            a2.checked = true
        }
    }
    updateModesDisplay()
    try {
        document.getElementById('t' + result['side']).checked = true
        display.innerHTML = descriptions[+result['side']]
        wizard.panels.updatePanelsContainerHeight()
    } catch (e) {
        console.log(e)
    }
})
