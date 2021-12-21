import React, { useRef, cloneElement } from 'react'
import propTypes from 'prop-types'
import styles from './FileUpload.module.scss'

const FileUpload = ({
  onChange,
  accept,
  multiple,
  children,
  isUploadFolder,
  ...other
}) => {
  const fileRef = useRef()

  const openFolderProp = isUploadFolder && {
    webkitdirectory: '',
  }

  const uploadClick = (childrenOnClick, childrenOnClickArgs) => {
    childrenOnClick && childrenOnClick(...childrenOnClickArgs)
    fileRef.current.click()
  }

  const onChangeHandler = e => {
    const { files } = e.target
    onChange(files, e)
  }

  const clearInput = e => {
    e.target.value = null
  }

  return (
    <>
      <input
        {...openFolderProp}
        className={styles.hide}
        ref={fileRef}
        type={'file'}
        accept={accept}
        multiple={multiple}
        onChange={onChangeHandler}
        onClick={clearInput}
        {...other}
      />
      {
        // extend children onClick
        React.Children.map(children, child =>
          cloneElement(child, {
            onClick: (...args) => uploadClick(child.props.onClick, args),
          }),
        )
      }
    </>
  )
}

FileUpload.defaultProps = {
  onChange: () => {},
  isUploadFolder: false,
}

FileUpload.propTypes = {
  /** Callback fire when upload file changed. <code>(files, event) => {}</code> */
  onChange: propTypes.func,
  /** Defines the file types. */
  accept: propTypes.string,
  /** When true allows the user to select more than one file. */
  multiple: propTypes.bool,
  /** HTML element or Component to render. */
  children: propTypes.element,
  /** Is upload entire folder */
  isUploadFolder: propTypes.bool,
}

export default FileUpload
