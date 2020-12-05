import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import { Comment, Tooltip, List, Card, Avatar } from 'antd'
import axios from '@/utils/axios'
import useAjaxLoading from '@/hooks/useAjaxLoading'
import dayjs from '@/utils/dayjs'
import { RandomId } from 'utils'
const { Meta } = Card

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1000
}

function FragmentList(props) {
  const [loading, withLoading] = useAjaxLoading()

  const [fragment, setFragment] = useState([])

  useEffect(() => {
    withLoading(axios.get(`/fragment`))
      .then(res => {
        console.log(res)
        // console.log(moment('2020-12-06T04:00:00.000Z').format('MMMM Do YYYY, h:mm:ss a'))
        setFragment(res.rows)
      })
      .catch(e => {
        console.log(e)
        props.history.push('/404')
      })
  }, [])

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
    <div>
      <img
        alt='今日诗词'
        src='https://v2.jinrishici.com/one.svg'
        style={{
          height: '30px',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}></img>
      <List
        // grid={{
        //   gutter: 16,
        //   xs: 1,
        //   sm: 2,
        //   md: 4,
        //   lg: 4,
        //   xl: 6,
        //   xxl: 3,
        // }}
        size={'large'}
        header={`闲言 【${fragment.length}】`}
        dataSource={fragment}
        split={true}
        renderItem={item => (
          <List.Item key={item.title}>
            <List.Item.Meta
              style={{ display: 'flex', flexDirection: 'row', flex: '1' }}
              avatar={<Avatar src={'http://127.0.0.1/static/media/avatar.7e58ba1b.jpeg'} />}
              title={'种菜的小朋友'}
              description={dayjs(item.createdAt, 'YYYYMMDD').fromNow()}
            />
            <div style={{ display: 'flex', flexDirection: 'row', flex: '3', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{item.content}</div>
              <Avatar
                size={{
                  xs: 24,
                  sm: 32,
                  md: 40,
                  lg: 64,
                  xl: 80,
                  xxl: 100,
                }}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
                alt='logo'
                src={'https://picsum.photos/id/' + getRandomInt(100) + '/300/400'}
              />
            </div>
          </List.Item>
          // <List.Item>
          //   <Card
          //     style={{ width: 300 }}
          //     // cover={
          //     //   <img
          //     //     alt='随机图片'
          //     //     src={'https://picsum.photos/id/' + getRandomInt(100) + '/300/400'}
          //     //   />
          //     // }
          //   >
          //     <Meta
          //       title={dayjs(item.createdAt, 'YYYYMMDD').fromNow()}
          //       avatar={<Avatar src='http://127.0.0.1/static/media/avatar.7e58ba1b.jpeg' />}
          //       description={item.content}
          //       // datetime={moment('2020-12-06T04:00:00.000Z').format('MMMM Do YYYY, h:mm:ss a')}
          //     />
          //   </Card>
          // </List.Item>
        )}
      />
    </div>
  )
}

export default FragmentList
