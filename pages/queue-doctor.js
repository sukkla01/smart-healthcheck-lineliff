import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NavHeader from '../component/NavHeader'
import ProfilePage from '../component/ProfilePage'
import { Button } from 'antd';

const QueueDoctor = () => {

  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [picture, setPicture] = useState('')

  let data = [
    { tname: 'xxx  xxxxx', dep: 'zzz zzzzz' },
    { tname: 'www  wwwww', dep: 'zzz zzzzz' }
  ]


  useEffect(() => {

    // getData()
    setName(localStorage.getItem('name'))
    setUserId(localStorage.getItem('userId'))
    setPicture(localStorage.getItem('picture'))
  })


  const onBack = () => {
    router.push({
      pathname: '/queue',
    })
  }

  const onNext = (value) => {
    router.push({
      pathname: '/queue-time',
      query: { dep: dep, date: dateShow },
    })


  }


  return (
    <div>
      <NavHeader />
      <div style={{ paddingTop: '20%' }}>
        {/* Profile */}
        <div style={{ backgroundColor: 'white', marginLeft: 15, marginRight: 10, height: 110, borderRadius: 15 }}>
          <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
            <div className='col-4'>
              <img src={picture} width={80} height={80} style={{ borderRadius: '50%' }} />

            </div>
            <div className='col-8'>
              <div className='row' style={{ fontSize: 15 }}>
                ชื่อ - สกุล : {name}
              </div>
              <div className='row' style={{ fontSize: 15, paddingTop: 20 }}>
                HN :
              </div>
            </div>
          </div>
        </div>
        {/* Profile */}
        <h6 style={{ color: 'black', paddingTop: 25, paddingLeft: 20, paddingRight: 15 }}>เลือกแพทย์</h6>



      </div>


      <div className='row' style={{ marginTop: 50, marginLeft: 10, marginRight: 10, marginBottom: 100 }} >
        <div className='col-6'>
          <Button type={"default"} shape="round" block size={'large'} onClick={onBack} >
            กลับ
          </Button>

        </div>
        <div className='col-6'>
          <Button type={"primary"} shape="round" block size={'large'} onClick={onNext} >
            ถัดไป
          </Button>

        </div>

      </div>
    </div>
  )
}

export default QueueDoctor