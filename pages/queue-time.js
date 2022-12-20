import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import ProfilePage from '../component/ProfilePage'
import { Button } from 'antd';
import { useRouter } from 'next/router'
import axios from 'axios'
import config from '../config'
import { Alert } from 'antd';


const BASE_URL = config.BASE_URL

const token = config.token
const QueueTime = () => {
    const router = useRouter()
    const [selectId, setSelectId] = useState(0)
    const { dep, date, profile, tname, hn_ } = router.query
    const [name, setName] = useState('')
    const [userId, setUserId] = useState('')
    const [picture, setPicture] = useState('')
    const [hn, setHn] = useState('')
    const [data, setData] = useState([]);
    const [isNext, setIsnext] = useState(false);

    // let data = ['17:00', '18:00']


    useEffect(() => {

        // getData()
        // setName(localStorage.getItem('name'))
        // setUserId(localStorage.getItem('userId'))
        // setPicture(localStorage.getItem('picture'))
        setName(tname)
        setUserId(JSON.parse(profile).userId)
        setPicture(JSON.parse(profile).pictureUrl)
        setHn(hn_)
        getSlot()

        


    }, [])

    const getSlot = async () => {
        try {
            let res = await axios.get(`${BASE_URL}/get-dep-slot-id/${dep}`, { headers: { "token": token } })
            setData(res.data)
            console.log(res.data)

        } catch (error) {
            console.log(error)
        }

    }
    const getTimeLimit = async (ttime) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-dep-slot-id-timelimit/${dep}/${ttime}`, { headers: { "token": token } })

            return res.data[0].max_limit

        } catch (error) {
            console.log(error)
        }

    }
    const getReserveCount = async (ttime) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-dep-slot-id-reserve-count/${dep}/${date}/${ttime}`, { headers: { "token": token } })
            console.log(res.data)
            return res.data[0].tcount

        } catch (error) {
            console.log(error)
        }

    }

    const onSelect = async (value) => {
        let TimeMax = await getTimeLimit(value)
        let ReserveCount = await getReserveCount(value)
        setSelectId(value)
        console.log(TimeMax)
        console.log(ReserveCount)
        if (parseInt(ReserveCount) >= parseInt(TimeMax)) {
            setIsnext(true)
        } else {
            setIsnext(false)
        }
    }

    const onNext = (value) => {
        if (selectId != '') {
            if (!isNext) {
                router.push({
                    pathname: '/queue-success',
                    query: { dep: dep, date: date, profile: profile, tname: tname, hn_: hn_, time: selectId },
                })
            }

        }

    }

    const onBack = (value) => {

        router.push({
            pathname: '/queue-date',
            query: { dep: dep, date: date, profile: profile, tname: tname, hn_: hn_ },
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
                                ชื่อ-สกุล : {name}
                            </div>
                            <div className='row' style={{ fontSize: 15, paddingTop: 10 }}>
                                HN : {hn}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profile */}
                <h6 style={{ color: 'black', paddingTop: 25, paddingLeft: 20, paddingRight: 15 }}>เลือกเวลาจองคิว</h6>



                <div className='row'>
                    {data.map((item, i) => {
                        console.log(item)
                        return <div className='col-4' key={i} >
                            <div className='text-center' style={{ backgroundColor: 'white', marginLeft: 15, marginRight: 10, height: 30, width: 100, borderRadius: 15, marginTop: 15, borderColor: selectId == item.ttime ? '#00bfa5' : 'white', borderWidth: 1, borderStyle: 'solid' }}
                                onClick={() => onSelect(item.ttime)}
                            >
                                <p style={{ paddingTop: 5 }}>{item.ttime}</p>
                            </div>

                        </div>
                    })}

                </div>

                <div style={{ marginTop: 25, marginLeft: 15, marginRight: 10 }}>
                    <p style={{ fontSize: 20 }} className="text-center">
                        {selectId != '' ?
                            <Alert message={isNext ? 'เต็ม' : 'จองได้'} type={isNext ? "error" : "success"} showIcon />
                            : ''}
                    </p>
                </div>

                <div className='row' style={{ marginTop: 40, marginLeft: 10, marginRight: 10, marginBottom: 100 }} >
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
        </div>
    )
}

export default QueueTime