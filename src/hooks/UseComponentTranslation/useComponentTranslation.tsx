import { useEffect, useState } from 'react'
import { Translations } from './useComponentTranslations.interfaces'

let sharedState: Translations = {
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
    selectOption: 'SelectOption',
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
    date: 'Date'
  },
  rangeSlider: {
    start: 'Start',
    end: 'End'
  },
  tree: {
    search: "Search",
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
    undo: 'Undo'
  }
}

const useComponentTranslation = () => {
  const [translations, _setTranslations] = useState<Translations>(sharedState)

  useEffect(() => {
    _setTranslations(sharedState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedState])

  const setTranslations = (newTranslations: Partial<Translations>) => {
    sharedState = {...sharedState, ...newTranslations}
    _setTranslations({...sharedState})
  }

  const getComponentTranslation = (
    key: keyof Translations,
  )=> {
    if (!translations[key])
      throw new Error(`${key} does not exist in translations`)
    return translations[key]
  }

  return { getComponentTranslation, setTranslations }
}

export default useComponentTranslation
