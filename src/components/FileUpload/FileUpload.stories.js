import React from 'react'
import { action } from '@storybook/addon-actions'
import { Button } from '../../index'
import FileUpload from './FileUpload'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Utils/FileUpload',
  component: FileUpload,
  decorators: [centerDecorator],
}

export const Basic = () => (
  <FileUpload onChange={action('Upload File Changed')}>
    <Button>Upload File</Button>
  </FileUpload>
)

export const Multiple = () => (
  <FileUpload onChange={action('Upload Files Changed')} multiple>
    <Button>Upload Files</Button>
  </FileUpload>
)

export const JustImage = () => (
  <FileUpload onChange={action('Upload Image')} accept={'image/*'}>
    <Button>Upload Images</Button>
  </FileUpload>
)
