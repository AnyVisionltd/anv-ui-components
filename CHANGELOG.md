## Unreleased

### Breaking Changes :boom:

- Change confirmation dialog prop for row action and bulk actions in Table, changed prop `confirmMassage:Stirng` to `confirmDialogBody:Any`

### Changed

- Changed default CSS of Tooltip's children

### Fixed

- Fixed falsey check in TextField that led to the label being on top of the inputted text
- Fixed Portal to remove itself from dom on unmount
- Fixed Menu to not self open when controlled from outside
- Fixed TextField cursor jump when deleting first letter
- Fixed Menu to not self open when controlled from outside
- TextField empty state bug
- Positioning of the menu dropdown by using popper JS
- Fixed cursor jumping to the end when using controlled TextField
- Tooltip child disabled bug fix
- Fix SSF menu position after delete chip

### Added

- Added menuContainerId to Menu to specify a containerId in the portal component
- Added menuProps to TextField component to be propagated to Menu component
- Added z-index to Tooltip component
- Added Banner component and implemented in DialogWizard
- Added tooltip show prop
- Added Tabs component
- Add View prop to \<TextField/> \<Checkbox/> \<Radio/> \<Switch/>
- Add FormProvider Component
- Add additionalFilters to tableSSF
- Add the ability to disable table row selection
- Add autocomplete to chips
- New `<Progress/>` component
- Add no results message to table
- Added `classes` prop to `<DialogWizard/>`
- New `<Tabs/>` component
- New RangeSlider component
- Added -webkit-auto-fill in InputBase

## 1.0.0 - 06-09-2020

### Breaking Changes :boom:

- Changed last step of DialogWizard to trigger onFinish
- Added onFinish callback function to DialogWizard
- Added label prop to textField
- Removed AttachedAxis and changed preferOpenDirection to match the directions PopperJS uses
- `<ChipsInput/>` - change onSubmit/onChange return value from `['string', 'string']` to `[{label: 'string'', value: 'any'}]`

### Changed

- Changed textfield to be uncontrolled

### Added

- New @anyvision/anv-icon section.
- Added triggerRowClick to table cell

## 0.1.3 - 01-09-2020

### Added

- New Table.
- New Text Field.
- New Wizard Dialog.
- Added default behavior that doesn't require isOpen in Menu

<!--
Sections:
### Breaking Changes :boom:
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
-->
