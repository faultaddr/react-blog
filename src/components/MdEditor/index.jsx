import React, { Component, useEffect, useState } from 'react'

import SimpleMDE from 'react-simplemde-editor'
import './easymde.min.css'

import { translateMarkdown2html } from '@/utils'

function MdEditor(props) {
  // useEffect(() => {}, [])

  // return <textarea id='simple-editor' style={{ display: 'none' }} />
  const getInstance = instance => {
    // You can now store and manipulate the simplemde instance.
    instance.togglePreview()
  }
  return (
    <SimpleMDE
      getMdeInstance= { getInstance }
      value={props.value}
      onChange={props.onChange}
      options={{ autofocus: true, autosave: {
        enabled: true,
        delay: 1000
      }, previewRender(text) {
        return translateMarkdown2html(text)
      }}
      }
    />
  )
}

export default MdEditor
