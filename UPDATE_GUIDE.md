# ReasonAI — Talent Acceleration update

## Upload to GitHub Pages

Upload these **five changed or added files** to the root of `reasonai-math/reasonai`:
- `index.html` (loads the scratchpad script)
- `app.js` (mounts the scratchpad, saves drawing evidence, displays it to teachers, terminology)
- `analysis.js` (adds provisional algorithmic profile metadata)
- `styles.css` (scratchpad styling)
- `scratchpad.js` (**new** file)

All other project files in this package are carried over from the previous ReasonAI UI release. **If your live repository has newer changes to those files, do not overwrite them.**

## Smoke test

1. Open Student Mode. Confirm symbol buttons appear above the scratchpad and insert at the cursor position in the explanation field.
2. Draw with pen; switch to eraser; Undo; Clear; draw again.
3. Submit a response with drawing and written explanation. Open Teacher analysis and expand 'View student scratchpad evidence'.
4. Test a correct, supported comparison: answer `3/4`; reasoning `3/4 = 6/8, and 6/8 > 5/8, so 3/4 is greater.` Confirm teacher analysis shows the Future AI Talent Profile, and teacher can approve Computational Scaling.
5. Test a correct but flawed rule: answer `3/4`; reasoning `3/4 is greater because a smaller denominator always means a larger fraction.` Confirm Heuristic Calibration is flagged and teacher review remains required.
6. Test an ambiguous explanation. It should remain 'Needs teacher review', not automatically classified as advanced reasoning.

## Important limits

- This is an **offline, rule-based prototype**, not a trained AI model or validated giftedness assessment.
- The drawing is saved as a PNG data URL alongside the response in browser localStorage. It is **not interpreted** by the text-only reasoning engine.
- localStorage is device/browser-local and size-limited; drawings may eventually exhaust the quota. Do not use this demo as a production student-record repository.
- This release passed JavaScript syntax checks; full browser QA and GitHub deployment are still required.
