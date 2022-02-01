import React, { useState, useEffect } from 'react'
import './index.scss'
import { Layout } from 'antd'
import {Typer} from './typer'
const WelcomeLayout = props => {
  function redirect() {
    props.history.push('/home')
  }
  return (
    <Layout style={{ width: '100%', height: '100%' }} >
      <div class='container' onClick={redirect}>

        {/* <div class='text-container'><div></div></div> */}
        <Typer/>
        <div class='bird-container bird-container--one'>
          <div class='bird bird--one'></div>
        </div>

        <div class='bird-container bird-container--two'>
          <div class='bird bird--two'></div>
        </div>

        <div class='bird-container bird-container--three'>
          <div class='bird bird--three'></div>
        </div>

        <div class='bird-container bird-container--four'>
          <div class='bird bird--four'></div>
        </div>

      </div>
    </Layout>

  )
}
export default WelcomeLayout
