import content from './languages/en.lang.json'

class LanguageService {
  constructor() {
    this.defaultLang = 'en'
    this.lang = this.defaultLang
  }

  changeLanguage(language) {
    this.lang = language
  }

  getCurrentLanguage() {
    return this.lang
  }

  getTranslation(path, replaceObject) {
    const translation = path.split('.').reduce((acc, part) => acc && acc[part], content[this.lang])
    if (!replaceObject) {
      return translation
    }
    return Object.keys(replaceObject).reduce((acc, key) => {
      acc = acc.replace(`{{ ${ key } }}`, replaceObject[key] || '')
      return acc
    }, translation)
  }

  getGeneralTranslation(path) {
    return this.getTranslation(`general.${ path }`)
  }
}

export default new LanguageService()
