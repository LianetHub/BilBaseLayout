"use strict";

document.addEventListener("DOMContentLoaded", () => {


    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows());
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 992) {
            document.body.classList.remove("_pc");
            document.body.classList.add("_touch");
        } else {
            document.body.classList.remove("_touch");
            document.body.classList.add("_pc");
        }
    }

    getNavigator();

    window.addEventListener('resize', () => {
        getNavigator()
    });


    var phoneInputs = document.querySelectorAll('input[type="tel"]');

    var getInputNumbersValue = function (input) {
        // Return stripped input value — just numbers
        return input.value.replace(/\D/g, '');
    }

    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    var onPhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            // Editing in the middle of input, not last symbol
            if (e.data && /\D/g.test(e.data)) {
                // Attempt to input non-numeric symbol
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }
    var onPhoneKeyDown = function (e) {
        // Clear input after remove last symbol
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }
    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }




    // Diagram

    const tabs = document.querySelectorAll('.benefits__tab');
    const allDiagrams = document.querySelectorAll('.benefits__diagram');

    const setupDiagramInteractivity = (diagramElement) => {

        if (!diagramElement) return;

        const diagramItems = diagramElement.querySelectorAll('.benefits__diagram-item');
        const diagramTexts = diagramElement.querySelectorAll('.benefits__diagram-text');
        const svgGroups = diagramElement.querySelectorAll('.benefits__diagram-image g');

        const deactivateAll = () => {
            diagramItems.forEach(item => item.classList.remove('active'));
            diagramTexts.forEach(text => {
                text.classList.remove('active');

                text.style.position = 'absolute';
                text.style.visibility = 'hidden';
            });
            svgGroups.forEach(group => group.classList.remove('active'));
        };


        if (svgGroups.length > 0) {
            svgGroups.forEach((group, index) => {
                if (group._currentMouseoverHandler) {
                    group.removeEventListener('mouseover', group._currentMouseoverHandler);
                }


                const mouseoverHandler = () => {
                    deactivateAll();
                    group.classList.add('active');
                    if (diagramItems[index]) {
                        diagramItems[index].classList.add('active');
                    }
                    if (diagramTexts[index]) {
                        diagramTexts[index].classList.add('active');

                        diagramTexts[index].style.position = 'static';
                        diagramTexts[index].style.visibility = 'visible';
                    }
                };

                group.addEventListener('mouseover', mouseoverHandler);
                group._currentMouseoverHandler = mouseoverHandler;
            });
        }
    };


    const activateDefaultDiagramItem = (diagramElement) => {
        if (!diagramElement) return;

        const diagramItems = diagramElement.querySelectorAll('.benefits__diagram-item');
        const diagramTexts = diagramElement.querySelectorAll('.benefits__diagram-text');
        const svgGroups = diagramElement.querySelectorAll('.benefits__diagram-image g');


        diagramItems.forEach(item => item.classList.remove('active'));
        diagramTexts.forEach(text => {
            text.classList.remove('active');
            text.style.position = 'absolute';
            text.style.visibility = 'hidden';
        });
        svgGroups.forEach(group => group.classList.remove('active'));


        if (diagramItems[2]) {
            diagramItems[2].classList.add('active');
        }
        if (diagramTexts[2]) {
            diagramTexts[2].classList.add('active');
            diagramTexts[2].style.position = 'static';
            diagramTexts[2].style.visibility = 'visible';
        }
        if (svgGroups[2]) {
            svgGroups[2].classList.add('active');
        }
    };


    if (tabs.length > 0 && allDiagrams.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');


                allDiagrams.forEach(diagram => diagram.classList.remove('active'));

                const targetDiagramId = tab.dataset.diagramTarget;
                const targetDiagram = document.getElementById(targetDiagramId);

                if (targetDiagram) {
                    targetDiagram.classList.add('active');
                    setupDiagramInteractivity(targetDiagram);
                    activateDefaultDiagramItem(targetDiagram);
                }
            });
        });


        allDiagrams.forEach(diagram => setupDiagramInteractivity(diagram));


        const initialActiveTab = document.querySelector('.benefits__tab.active');
        if (initialActiveTab) {
            const initialDiagramId = initialActiveTab.dataset.diagramTarget;
            const initialDiagram = document.getElementById(initialDiagramId);

            if (initialDiagram) {
                initialDiagram.classList.add('active');
                activateDefaultDiagramItem(initialDiagram);
            }
        } else {
            if (tabs[0] && allDiagrams[0]) {
                tabs[0].classList.add('active');
                allDiagrams[0].classList.add('active');
                activateDefaultDiagramItem(allDiagrams[0]);
            }
        }
    }










});


if (typeof Fancybox !== "undefined" && Fancybox !== null) {
    Fancybox.bind("[data-fancybox]", {
        dragToClose: false,
        closeButton: false
    });
}


HTMLElement.prototype.slideToggle = function (duration, callback) {
    if (this.clientHeight === 0) {
        _s(this, duration, callback, true);
    } else {
        _s(this, duration, callback);
    }
};

HTMLElement.prototype.slideUp = function (duration, callback) {
    _s(this, duration, callback);
};

HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
};

function _s(el, duration, callback, isDown) {

    if (typeof duration === 'undefined') duration = 400;
    if (typeof isDown === 'undefined') isDown = false;

    el.style.overflow = "hidden";
    if (isDown) el.style.display = "block";

    var elStyles = window.getComputedStyle(el);

    var elHeight = parseFloat(elStyles.getPropertyValue('height'));
    var elPaddingTop = parseFloat(elStyles.getPropertyValue('padding-top'));
    var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    var elMarginTop = parseFloat(elStyles.getPropertyValue('margin-top'));
    var elMarginBottom = parseFloat(elStyles.getPropertyValue('margin-bottom'));

    var stepHeight = elHeight / duration;
    var stepPaddingTop = elPaddingTop / duration;
    var stepPaddingBottom = elPaddingBottom / duration;
    var stepMarginTop = elMarginTop / duration;
    var stepMarginBottom = elMarginBottom / duration;

    var start;

    function step(timestamp) {

        if (start === undefined) start = timestamp;

        var elapsed = timestamp - start;

        if (isDown) {
            el.style.height = (stepHeight * elapsed) + "px";
            el.style.paddingTop = (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = (stepMarginBottom * elapsed) + "px";
        } else {
            el.style.height = elHeight - (stepHeight * elapsed) + "px";
            el.style.paddingTop = elPaddingTop - (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = elMarginTop - (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = elMarginBottom - (stepMarginBottom * elapsed) + "px";
        }

        if (elapsed >= duration) {
            el.style.height = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.marginTop = "";
            el.style.marginBottom = "";
            el.style.overflow = "";
            if (!isDown) el.style.display = "none";
            if (typeof callback === 'function') callback();
        } else {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}