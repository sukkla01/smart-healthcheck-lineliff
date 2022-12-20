import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { Button, message } from 'antd';
import { useRouter } from 'next/router'
import depData from '../data'
import * as moment from 'moment';
import 'moment/locale/th';
moment.locale('th')
import axios from 'axios'
import config from '../config'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = config.BASE_URL
const token = config.token

const QueueSuccess = () => {
    const router = useRouter()
    const [selectId, setSelectId] = useState(0)
    const { date,dep,profile,tname,hn_,time } = router.query
    const [name, setName] = useState('')
    const [userId, setUserId] = useState('')
    const [picture, setPicture] = useState('')
    const [depName, setDepName] = useState('')
    const [hn, setHn] = useState('')


    useEffect(() => {

        // getData()
        // setName(localStorage.getItem('tname'))
        // setUserId(localStorage.getItem('userId'))
        // setPicture(localStorage.getItem('picture'))
        // setHn(localStorage.getItem('hn'))

        setName(tname)
        setUserId(JSON.parse(profile).userId)
        setPicture(JSON.parse(profile).pictureUrl)
        setHn(hn_)
        console.log(depData)

       
        getDep()

    }, [])


    const getDep = async (userId) => {
        try {
          let res = await axios.get(`${BASE_URL}/get-dep-all`, { headers: { "token": token } })
          if (res.data.length > 0) {
            res.data.map((item, i) => {
                console.log(item.id)
                dep == item.id ? setDepName(item.name) : ''
            })
    
          }
        } catch (error) {
          console.log(error)
        }
      }

    const onSubmit = async () => {
        let data = {
            hn: hn,
            nextdate: date,
            dep: dep,
            userId : userId,
            ttime : time
        }
        try {
            let res = await axios.post(`${BASE_URL}/add-reserve`, data, { headers: { "token": token } })

            if (res.status == 200) {
                router.push({
                    pathname: '/reserv-success',
                    query: { userId: userId },
                })
            } else {
                toast.warn('มีการจองแล้วในวัน กรุณาเลือกวันอื่น', {
                    position: "bottom-center",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }


        } catch (error) {
            console.log(error)
        }
    }

    const onBack = (value) => {
        if(time == ''){
            router.push({
                pathname: '/queue-date',
                query: { dep: dep, date: date,profile:profile,tname:tname,hn_:hn },
            })
    
        }else{
            router.push({
                pathname: '/queue-time',
                query: { dep: dep, date: date,profile:profile,tname:tname,hn_:hn },
            })
    
        }

       

    }


    return (
        <div>
            <NavHeader />

            <div style={{ paddingTop: '17%' }}>
                {/* Profile */}
                <div style={{ backgroundColor: 'white', marginLeft: 15, marginRight: 10, height: 110, borderRadius: 15 }}>
                    <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                        <div className='col-4'>
                            <img src={picture} width={80} height={80} style={{ borderRadius: '50%' }} />

                        </div>
                        <div className='col-8'>
                            <div className='row' style={{ fontSize: 15 }}>
                                ชื่อ-สกุล : {name}
                            </div>
                            <div className='row' style={{ fontSize: 15, paddingTop: 10 }}>
                                HN : {hn}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profile */}

                <div style={{ backgroundColor: 'white', marginLeft: 15, marginRight: 10, height: 150, borderRadius: 15, marginTop: 20 }}>
                    <div className='text-center' style={{ marginTop: 0 }}>
                        <div style={{ fontSize: 17, paddingTop: 20, fontWeight: 'bold' }}>
                            ข้อมูลการจอง
                        </div>
                        <div style={{ fontSize: 15, paddingTop: 20 }}>
                            แผนก : {depName}
                        </div>
                        <div style={{ fontSize: 15, paddingTop: 10 }}>
                            วันที่จอง : {moment(date).add(543, 'year').format('LL')}
                        </div>
                    </div>
                    {/* <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                       
                        <div className='col-12 '>
                            <div className='row' style={{ fontSize: 15,textAlign:'center' }}>
                                แผนก : xxxxx
                            </div>
                            <div className='row' style={{ fontSize: 15, paddingTop: 20 }}>
                                วันที่จอง : xxxxx
                            </div>
                        </div>
                    </div> */}
                </div>


                <div className='row' style={{ marginTop: 20, marginLeft: 10, marginRight: 10, marginBottom: 100 }} >
                    <div className='col-6'>
                        <Button type={"default"} shape="round" block size={'large'} onClick={onBack} >
                            กลับ
                        </Button>

                    </div>
                    <div className='col-6'>
                        <Button type={"primary"} shape="round" block size={'large'} onClick={onSubmit} >
                            ยืนยัน
                        </Button>

                    </div>

                </div>





                <ToastContainer
                    position="bottom-center"
                    autoClose={8000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme='dark'
                />




            </div>
        </div>
    )
}

export default QueueSuccess