import React, { useState, useEffect, Component } from 'react'
import { io } from 'socket.io-client'
import { SERVER_URL, API_BASE_URL } from '@/config'
import { Gauge, Area } from '@ant-design/charts'
import axios from '@/utils/axios'
import DemoLiquid from './DemoLiquid'
const ws = io.connect(SERVER_URL + ':1234')

function Monitor(props) {
  var [percentList, setPercentList] = useState([])
  var [percent, setPercent] = useState(0.2)
  var [rangeColor, setRangeColor] = useState('#F4664A')
  var color = ['#F4664A', '#FAAD14', '#30BF78']
  var ref
  var [memPercent, setMemPercent] = useState(0.26)
  var [memPercentList, setMemPercentList] = useState([])
  var mref
  // Liquad
  useEffect(() => {
    asyncFetch()
  }, [])
  // Guage
  var getColor = function getColor(percent) {
    return percent < 0.4 ? color[0] : percent < 0.6 ? color[1] : color[2]
  }
  var configGuage = {
    percent,
    range: { color: rangeColor },
    indicator: {
      pointer: { style: { stroke: '#D0D0D0' } },
      pin: { style: { stroke: '#D0D0D0' } },
    },
    axis: {
      label: {
        formatter: function formatter(v) {
          return Number(v) * 100
        },
      },
      subTickLine: { count: 3 },
    },
    statistic: {
      content: {
        formatter: function formatter(_ref) {
          var percent = _ref.percent
          return 'CPU占用率: '.concat((percent * 100).toFixed(0), '%')
        },
      },
      style: { fontSize: 60 },
    },
    animation: false,
  }
  var configCPU = {
    data: percentList,
    xField: 'date',
    yField: 'usage',
    annotations: [
      {
        type: 'text',
        position: ['min', 'median'],
        content: '中位数',
        offsetY: -4,
        style: { textBaseline: 'bottom' },
      },
      {
        type: 'line',
        start: ['min', 'median'],
        end: ['max', 'median'],
        style: {
          stroke: 'red',
          lineDash: [2, 2],
        },
      },
    ],
  }
  var configMEM = {
    data: memPercentList,
    xField: 'date',
    yField: 'usage',
    annotations: [
      {
        type: 'text',
        position: ['min', 'median'],
        content: '中位数',
        offsetY: -4,
        style: { textBaseline: 'bottom' },
      },
      {
        type: 'line',
        start: ['min', 'median'],
        end: ['max', 'median'],
        style: {
          stroke: 'red',
          lineDash: [2, 2],
        },
      },
    ],
  }

  //   cpuUsage: (currCPU * 100.0).toFixed(2) + '%',
  //   freeMem: freeMem.toFixed(2) + 'G',
  //   totalMem: totalMem.toFixed(2) + 'G',
  //   usedMem: (totalMem - freeMem).toFixed(2) + 'G',
  //   MemUsage: (((totalMem - freeMem) / totalMem) * 100.0).toFixed(2) + '%',
  // 對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
  const asyncFetch = () => {
    axios.get('/monitor/start').then(res => {
    })
    ws.on('systemUpdate', message => {
      // get the cpu message to plot the graph
      percentList = [...percentList, { usage: parseFloat(message.cpuUsage), date: new Date().toLocaleString() }]
      memPercentList = [...memPercentList, { usage: parseFloat(message.MemUsage), date: new Date().toLocaleString() }]
      setPercentList(percentList)
      setMemPercentList(memPercentList)
      setPercent(parseFloat(message.cpuUsage))
      setMemPercent(parseFloat(message.MemUsage))
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80%' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Gauge {...configGuage} chartRef={chartRef => (ref = chartRef)} />
        <Area {...configCPU} style={{ width: '50%' }} />
      </div>
      <p></p>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        <DemoLiquid percent={memPercent} />
        <Area {...configMEM} style={{ width: '50%' }} />
      </div>
    </div>
  )
}

export default Monitor
