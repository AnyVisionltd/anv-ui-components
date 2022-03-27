import { renderHook, act } from '@testing-library/react-hooks'
import useComponentTranslation from './useComponentTranslation'

describe('UseComponentTranslation - getComponentTranslation & setTranslations', () => {
  const { result } = renderHook(() => useComponentTranslation())

  describe('getComponentTranslation', () => {
    test('Should throw an error if passed key is not in Translations interface', () => {
      const { getComponentTranslation } = result.current
      let error
      try {
        //@ts-ignore
        getComponentTranslation('hello')
      } catch (err) {
        error = err
      }
      expect(error).toBeTruthy()
    })

    test("Should return the component's translations", () => {
      const { getComponentTranslation } = result.current
      const translations = getComponentTranslation('dateAndTimePicker')
      expect(translations).toBeTruthy()
      expect(Object.keys(translations)).toEqual(['dateAndTime'])
    })
  })

  describe('setTranslations', () => {
    test('should change the translation of a component', () => {
      const { setTranslations, getComponentTranslation } = result.current
      const currentTranslations: any = getComponentTranslation('timePicker')
      expect(currentTranslations.time).toBe('Time')
      act(() => {
        setTranslations({ timePicker: { time: 'hour' } })
      })
      setTimeout(() => {
        expect(currentTranslations.time).toBe('hour')
      }, 100)
    })
  })
})
