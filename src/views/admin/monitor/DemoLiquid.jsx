import React, {Component, PropTypes} from 'react'
import { Liquid } from '@ant-design/charts'
export default class DemoLiquid extends Component {
  constructor(props) {
    super(props)
    this.state = { percent: 0.25 }
  }
  render() {
    const {percent} = this.props
    var ref
    var config = {
      percent,
      statistic: {
        title: {
          formatter: function formatter() {
            return '内存利用率'
          },
          style: function style(_ref) {
            var percent = _ref.percent
            return { fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)' }
          },
        },
        content: {
          style: function style(_ref2) {
            var percent = _ref2.percent
            return {
              fontSize: 60,
              lineHeight: 1,
              fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
            }
          },
        },
      },
      liquidStyle: function liquidStyle(_ref4) {
        var percent = _ref4.percent
        return {
          fill: percent > 0.75 ? '#5B8FF9' : '#FAAD14',
          stroke: percent > 0.75 ? '#5B8FF9' : '#FAAD14',
        }
      },
      color: function color() {
        return '#5B8FF9'
      },
    }
    return <Liquid {...config} chartRef={chartRef => (ref = chartRef)} />
  }
}
