import { useEffect, useState } from 'react'

let sharedState = {
  table: {
    dialogHeader: 'Column Management',
    saveButton: 'Save',
    noResultsFound: 'No results found',
    noResultsMessage:
      'Try adjusting your search or filter to find what your’e looking for.',
    results: 'Results',
    showHideColumns: 'Show/Hide Columns',
    selected: 'Selected',
    yes: 'Yes',
    no: 'No',
  },
  dialogWizard: {
    finish: 'Finish',
    cancel: 'Cancel',
    next: 'Next',
    step: 'step',
    stepOutOf: 'out of',
  },
  textField: {
    none: 'None',
  },
  dropDown: {
    itemSelected: 'Item Selected',
    itemsSelected: 'Items Selected',
    selectOption: 'Select Option',
    label: 'Label',
    noResultsFound: 'No results found',
  },
  resultsIndicator: {
    completed: 'Completed',
    inQueue: 'In queue',
    stopped: 'Stopped',
    done: 'Done',
    failed: 'Failed',
  },
  progressWithIndicator: {
    processing: 'Processing',
  },
  dateAndTimePicker: {
    dateAndTime: 'Date & Time',
  },
  timePicker: {
    time: 'Time',
  },
  datePicker: {
    date: 'Date',
  },
  rangeSlider: {
    start: 'Start',
    end: 'End',
  },
  tree: {
    search: 'Search',
    item: 'Item',
    items: 'Items',
    listIsEmpty: 'List is Empty',
    selectNone: 'Select None',
    selectAll: 'Select All',
    collapseAll: 'Collapse All',
    expandAll: 'Expand All',
    selected: 'Selected',
    clearSearch: 'Clear ',
    noResultsFound: 'No Results Found',
  },
  toastMessage: {
    undo: 'Undo',
  },
  autocomplete: {
    selectOption: 'select option',
    label: 'label',
    noResultsFound: 'No Results',
  },
  dynamicFilterDateTime: {
    fromDatePickerLabel: 'From Date & Time',
    toDatePickerLabel: 'To Date & Time',
    DateTimeSubLabel: 'Specific Time',
    DateTimeDurationSubLabel: 'During the Last',
    DateTimeDurationDropdownLabel: 'Durtion',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
  },
  dynamicFilterListFilter: {
    title: 'Filter',
    searchPlaceholder: 'Search',
    selectAll: 'Select All/None',
    loading: 'Loading...',
    noResults: 'No Results',
  },
  dynamicFilterMenu: {
    applyBtn: 'Apply',
  },
}

const useComponentTranslation = () => {
  const [translations, _setTranslations] = useState(sharedState)

  useEffect(() => {
    _setTranslations(sharedState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedState])

  const setTranslations = (newTranslations: Partial<typeof sharedState>) => {
    sharedState = { ...sharedState, ...newTranslations }
    _setTranslations({ ...sharedState })
  }

  const getComponentTranslation = (key: keyof typeof sharedState) => {
    if (!translations[key])
      throw new Error(`${key} does not exist in translations`)
    return translations[key]
  }

  return { getComponentTranslation, setTranslations }
}

export default useComponentTranslation
