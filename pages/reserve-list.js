import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import { Badge, Popconfirm } from 'antd';
import * as moment from 'moment';
import 'moment/locale/th';
moment.locale('th')
import axios from 'axios'
import config from '../config'
import ReactLoading from 'react-loading';
import styled from "tachyons-components";

const BASE_URL = config.BASE_URL
const token = config.token

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;

const ReserveList = () => {
    const router = useRouter()
    const [selectId, setSelectId] = useState(0)
    const { dep, date } = router.query
    const [name, setName] = useState('')
    const [userId, setUserId] = useState('')
    const [picture, setPicture] = useState('')
    const [hn, setHn] = useState('')
    const [data, setData] = useState([])
    const [profile, setProfile] = useState({})
    const [isLoading, setIsLoading] = useState(true);

    const colort = ['#ffc400', '#00e676', '#f50057']
    const textStatus = ['รอเจ้าหน้าที่ลงทะเบียน', 'จองเรียบร้อย', '#f50057']


    useEffect(() => {

        localStorage.setItem('path', 'reserve-list');
        async function getData() {
            const liff = (await import('@line/liff')).default
            await liff.ready
            const profile = await liff.getProfile()
            setProfile(profile)
            localStorage.setItem('name', profile.displayName);
            localStorage.setItem('userId', profile.userId);
            localStorage.setItem('picture', profile.pictureUrl);

            getDataRe(profile.userId)
            getCid(profile.userId)
        }
        getData()
        // getCid('U2c04ba314d6649a7f6f2cc3b554b0ad9')
    }, [])


    const getDataRe = async (userIdv) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-reserve/${userIdv}`, { headers: { "token": token } })
            console.log(res.data)
            setData(res.data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const getCid = async (userId) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-register-cid/${userId}`, { headers: { "token": token } })
            if (res.data.length > 0) {
                setHn(res.data[0].hn)
                setName(res.data[0].tname)
                localStorage.setItem('tname', res.data[0].tname);

            } else {

                router.push({
                    pathname: '/register',
                    query: { userId: userId },
                })
            }




        } catch (error) {
            console.log(error)
        }
    }


    const onSelect = (vn) => {


        router.push({
            pathname: '/reserve-list-id',
            query: { vn: vn },
        })



    }

    const onDel = async (id) => {
        let data = {
            id: id
        }
        try {
            let res = await axios.post(`${BASE_URL}/del-reserve`, data, { headers: { "token": token } })
            getDataRe(profile.userId)

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div>
            <NavHeader />

            <div style={{ paddingTop: '17%' }}>
                <div style={{ backgroundColor: 'white', marginLeft: 15, marginRight: 10, height: 110, borderRadius: 15 }}>
                    <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                        <div className='col-4'>
                            <img src={Object.keys(profile).length == 0 ? './images/user.gif' : profile.pictureUrl} width={80} height={80} style={{ borderRadius: '50%' }} />

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
                <h6 style={{ color: 'black', paddingTop: 25, paddingLeft: 20, paddingRight: 15 }}>รายการจอง  </h6> 
                
                { isLoading ? <div className='text-center'> <Section><ReactLoading type='bubbles' color='#AAAAAA' height={'20%'} width={'20%'} /></Section></div> :    data.map((item, i) => {
                    return <div style={{ backgroundColor: 'white', marginLeft: 15, marginRight: 10, height: 80, borderRadius: 15, marginTop: 10 }} key={i}  onClick={() => onSelect(item.vn_reserve)}>
                        <div className='row' style={{ paddingTop: 5, paddingLeft: 10 }}>
                            <div className='col-2'>
                                <img src='./images/calendar.gif' width={50} height={50} style={{ borderRadius: '50%', marginTop: 10 }} />
                            </div>
                            <div className='col-8'>
                                <div>แผนก : {item.name}</div>
                                <div style={{ marginTop: 2 }}>วันที่จอง : {moment(item.nextdate).add(543, 'year').format('LL')}</div>
                                {/* <Badge color={colort[parseInt(item.status) - 1]} text={textStatus[parseInt(item.status) - 1]} /> */}
                                <Badge color={colort[1]} text={textStatus[1]} />
                                {/* <div className='text-center' style={{ backgroundColor:colort[parseInt(item.status)-1], height: 20, borderRadius: 15, width: 130 }}><div style={{ marginTop: 0 }}>รอการตรวจสอบ</div> </div> */}
                            </div>
                            {/* <div className='col-2' >
                                {item.status == 1 ?
                                <Popconfirm placement="leftBottom" title={'ต้องการลบหรือไม่'} onConfirm={()=> onDel(item.vn_reserve)} okText="ตกลง" cancelText="ไม่">
                                     <img src='./images/del.jpg' width={50} height={50} style={{ marginLeft: -20, marginTop: 10 }}  />
                                </Popconfirm>
                                    : ''}
                            </div> */}

                        </div>
                    </div>
                })    }

            </div>
        </div>
    )
}

export default ReserveList