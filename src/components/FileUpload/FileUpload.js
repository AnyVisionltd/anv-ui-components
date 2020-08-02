import React, { useRef, cloneElement } from 'react'
import propTypes from 'prop-types'
import styles from './FileUpload.module.scss'

const FileUpload = ({ onChange, accept, multiple, children, ...other }) => {
  const fileRef = useRef()

  const uploadClick = (childrenOnClick, childrenOnClickArgs) => {
    childrenOnClick(...childrenOnClickArgs)
    fileRef.current.click()
  }

  const onChangeHandler = e => {
    const { files } = e.target
    return onChange( files, e )
  }

  return (
    <>
      <input
        className={ styles.hide }
        ref={ fileRef }
        type={ 'file' }
        accept={ accept }
        multiple={ multiple }
        onChange={ onChangeHandler }
        { ...other }
      />
      {
        React.Children.map(children, (
          child => cloneElement(child, {
            onClick: (...args) => uploadClick(child.props.onClick, args)
          })
        ))
      }
    </>
  )
}

FileUpload.defaultProps = {
  onChange: () => {}
}

FileUpload.propTypes = {
  /** Callback fire when upload file changed. <code>(files, event) => {}</code> */
  onChange: propTypes.func,
  /** Defines the file types. */
  accept: propTypes.string,
  /** When true allows the user to select more than one file. */
  multiple: propTypes.string,
  /** Component to render. */
  children: propTypes.node,
}

export default FileUpload
