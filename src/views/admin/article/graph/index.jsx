import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/config'
import { Line } from '@ant-design/charts'
const DemoLine = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    asyncFetch()
  }, [])
  const asyncFetch = () => {
    fetch(API_BASE_URL + '/record')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.log('fetch data failed', error)
      })
  }
  var config = {
    data: data,
    xField: 'time',
    yField: 'cnt',
    seriesField: 'articleId',
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat((v / 1).toFixed(1), ' B')
        },
      },
    },
    legend: { position: 'top' },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  }
  return <Line {...config} />
}
export default DemoLine
