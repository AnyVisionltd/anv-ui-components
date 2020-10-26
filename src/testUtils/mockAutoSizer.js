import AutoSizer from 'react-virtualized-auto-sizer'

class mockAutoSizer {
  static size(size) {
    AutoSizer.mockImplementation(({ children }) =>
      children({ height: size, width: size }),
    )
  }
  static restore() {
    AutoSizer.mockRestore()
  }
}

export default mockAutoSizer
