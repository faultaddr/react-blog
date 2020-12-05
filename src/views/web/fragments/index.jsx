import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import { Comment, Tooltip, List } from 'antd'
import moment from 'moment'
import axios from '@/utils/axios'
import useAjaxLoading from '@/hooks/useAjaxLoading'
function FragmentList(props) {
  const [loading, withLoading] = useAjaxLoading()

  const [fragment, setFragment] = useState([])

  useEffect(() => {
    withLoading(axios.get(`/fragment`))
      .then(res => {
        setFragment(res.row)
      })
      .catch(e => {
        console.log(e)
        props.history.push('/404')
      })
  })

  //   const data = [
  //     {
  //       actions: [<span key='comment-list-reply-to-0'>Reply to</span>],
  //       author: 'Han Solo',
  //       avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  //       content: (
  //         <p>
  //           We supply a series of design principles, practical patterns and high quality design resources (Sketch and
  //           Axure), to help people create their product prototypes beautifully and efficiently.
  //         </p>
  //       ),
  //       datetime: (
  //         <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
  //           <span>{moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}</span>
  //         </Tooltip>
  //       ),
  //     },
  //     {
  //       actions: [<span key='comment-list-reply-to-0'>Reply to</span>],
  //       author: 'Han Solo',
  //       avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  //       content: (
  //         <p>
  //           We supply a series of design principles, practical patterns and high quality design resources (Sketch and
  //           Axure), to help people create their product prototypes beautifully and efficiently.
  //         </p>
  //       ),
  //       datetime: (
  //         <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
  //           <span>{moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}</span>
  //         </Tooltip>
  //       ),
  //     },
  //   ]
  return (
    <List
      className='comment-list'
      header={`${fragment.length} replies`}
      itemLayout='horizontal'
      dataSource={fragment}
      renderItem={item => (
        <li>
          <Comment
            author={item.author}
            avatar={item.avatar}
            content={item.content}
            datetime={item.datetime}
          />
        </li>
      )}
    />
  )
}

export default FragmentList
