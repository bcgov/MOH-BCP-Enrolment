// Shared helpers for the moh-common-lib-angular form controls and bcp's own
// wrapper components that recur across the register-facility and
// practitioner-registration flows. Every DOM shape referenced here was read
// out of the compiled component templates that ship in
// node_modules/moh-common-lib-angular/fesm2022/moh-common-lib-angular.mjs
// (the library has no source .html files in this install, only the AOT
// output), not out of the deleted Protractor page objects - those were only
// read to see field order and to source fixture values.
//
// - common-name, common-phn, common-street, common-city, common-postal-code,
//   common-email and common-phone-number all render a plain
//   `<label>{{label}}</label>` followed by a sibling `<input>`, and the
//   label text is interpolated so it is always present regardless of build
//   mode. None of their ids are stable (suffixed with a runtime uuid), so
//   every helper here locates fields by their visible label text instead.
// - common-date (moh-common-lib-angular.mjs, DateComponent, ~line 3825)
//   renders a `<fieldset><legend>` followed by
//   `<select aria-label="Month">`, `<input aria-label="Day">` and
//   `<input aria-label="Year">`, each wired to (blur) only - a value that is
//   typed/selected but never blurred never reaches the bound form control.
// - common-radio (RadioComponent, ~line 5562) renders a
//   `<fieldset><legend>{{label}}</legend>` (blank when no `label` input is
//   bound) followed by one `<div class="md-radio">` per option, each with
//   `<label>{{val.label}}</label>` next to its `<input type="radio">`.

/** Types into the input inside a labelled custom element (common-name,
 * common-city, common-postal-code, common-phone-number, common-email,
 * common-street, ...). */
function fillLabeledField(tag, labelText, value) {
  cy.contains(tag, labelText).find('input').clear().type(value);
}

/** Fills a common-date field, identified by its legend text, with a
 * {month, day, year} object. month is 0-based (January = 0), matching the
 * *ngFor index common-date's <option> uses.
 *
 * DateComponent wires the month select and the day/year inputs to (blur)
 * only - onBlurMonth/onBlurDay/onBlurYear each read only their own
 * event.target.value into _month/_day/_year, and only processDate() (called
 * from those same blur handlers) pushes a non-null date into the form
 * control once all three parts are set. Each field is blurred explicitly
 * here rather than left to the next command's focus shift. */
function fillDate(legendText, { month, day, year }) {
  const scope = () => cy.contains('common-date', legendText);
  scope().find('select[aria-label="Month"]').select(String(month)).blur();
  scope().find('input[aria-label="Day"]').clear().type(String(day)).blur();
  scope().find('input[aria-label="Year"]').clear().type(String(year)).blur();
}

/** Clicks a common-radio option by the fieldset's legend text and the
 * option's own label text (e.g. "No" / "Yes"). Use chooseRadioByOptionText
 * instead when the radio group has no legend (bcp's isQualifyForBCP group
 * does not bind a `label` input, so its legend renders blank). */
function chooseRadio(legendText, optionLabel) {
  cy.contains('common-radio', legendText).contains('label', optionLabel).click();
}

/** Clicks a common-radio option by its own option label text alone. Used
 * where the surrounding fieldset has no legend to scope by. */
function chooseRadioByOptionText(optionLabel) {
  cy.contains('common-radio label', optionLabel).click();
}

/** Clicks the button rendered by common-form-action-bar. Every page in both
 * flows has exactly one, and its class is stable ("submit") even though its
 * visible text changes ("Continue" vs "Submit"). */
function clickActionBarButton() {
  cy.get('common-form-action-bar button.submit').click();
}

/** Checks the consent modal's agreement checkbox by the agreeLabel text
 * passed to bcp-consent-modal, and clicks the modal's own continue button.
 *
 * ConsentModalComponent (moh-common-lib-angular.mjs, ~line 3213) suffixes
 * the checkbox's id/for with a runtime objectId ('agree_' + objectId), so
 * the old Protractor selector label[for="agree"] no longer matches anything
 * - the label is targeted by its text instead. The button carries no
 * type="submit" in the redesigned template (button type="button", class
 * "btn btn-block btn-primary" inside .modal-footer), so it is targeted by
 * its scoped position instead of the old button[type="submit"] selector. */
function acceptConsentModal(agreeLabelText) {
  cy.contains('.modal.show .form-check-label', agreeLabelText).click();
  cy.get('.modal.show .modal-footer button').click();
}

/** Draws a signature on bcp-signature's canvas and accepts it.
 *
 * signature_pad v5 (node_modules/signature_pad/dist/signature_pad.js:304-306)
 * uses PointerEvent handling whenever window.PointerEvent exists and the
 * browser is not iOS Safari, which is true for both Chrome and Electron.
 * _handlePointerDown requires event.buttons === 1
 * (_isLeftButtonPressed(event, true), line 364), _handlePointerMove requires
 * the same, and _handlePointerUp requires buttons === 0 (line 481-482) -
 * matching a real mouse's native buttons value on press, drag and release.
 * pointerId is held constant across the three events so _allowPointerId
 * (line 456) accepts the move/up as continuing the same stroke. */
function drawSignature() {
  cy.contains('button', 'Sign').click();
  cy.get('canvas.signature-pad-canvas').should('be.visible').then(($canvas) => {
    const rect = $canvas[0].getBoundingClientRect();
    const x1 = rect.left + 20;
    const y1 = rect.top + 20;
    const x2 = rect.left + 120;
    const y2 = rect.top + 80;
    cy.wrap($canvas)
      .trigger('pointerdown', {
        eventConstructor: 'PointerEvent', pointerId: 1, isPrimary: true,
        button: 0, buttons: 1, clientX: x1, clientY: y1,
      })
      .trigger('pointermove', {
        eventConstructor: 'PointerEvent', pointerId: 1, isPrimary: true,
        button: 0, buttons: 1, clientX: x2, clientY: y2,
      })
      .trigger('pointerup', {
        eventConstructor: 'PointerEvent', pointerId: 1, isPrimary: true,
        button: 0, buttons: 0, clientX: x2, clientY: y2,
      });
  });
  cy.contains('button', 'Accept').click();
}

module.exports = {
  fillLabeledField,
  fillDate,
  chooseRadio,
  chooseRadioByOptionText,
  clickActionBarButton,
  acceptConsentModal,
  drawSignature,
};
