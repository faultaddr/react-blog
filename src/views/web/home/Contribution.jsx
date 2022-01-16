import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useMediaQuery } from 'react-responsive'

// components
import { Divider, Empty, Drawer, Tag, Spin } from 'antd'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import axios from '@/utils/axios'
import useAjaxLoading from '@/hooks/useAjaxLoading'
const title = 'github contribution'

const ContributionChart = props => {
  const { showTitle = true } = props
  const [contributions, setContributions] = useState([])
  const [loading, withLoading] = useAjaxLoading()
  useEffect(() => {
    axios.get(`/user/github/contributions`)
      .then(res => {
        
        setContributions(res)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  return (
    <ul className='github'>
      {showTitle && <Divider>{title}</Divider>}
      <CalendarHeatmap
        startDate={contributions && contributions.length ? new Date(contributions.date[0].dataDate) : new Date('2021-01-01')}
        endDate={contributions && contributions.length ? new Date(contributions[contributions.date.length - 1].dataDate) : new Date('2021-12-31')}
        values={contributions && contributions.length ? contributions.count : []}
      />
    </ul>
  )
}

export default ContributionChart
