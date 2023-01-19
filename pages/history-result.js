import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import ProfilePage from '../component/ProfilePage'
import { Button, Steps } from 'antd';
import axios from 'axios'
import config from '../config'
import ReactLoading from 'react-loading';
import styled from "tachyons-components";
import Head from 'next/head'
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");

const BASE_URL = config.BASE_URL
const token = config.token
export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;

const HistoryResult = () => {
    const router = useRouter()
    const [profile, setProfile] = useState({})
    const [hn, setHn] = useState('')
    const [tage, setTage] = useState('')
    const [tname, setTname] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {

        localStorage.setItem('path', 'queue');
        async function getData() {
            const liff = (await import('@line/liff')).default
            await liff.ready
            const profile = await liff.getProfile()
            console.log(profile)
            setProfile(profile)
            localStorage.setItem('name', profile.displayName);
            localStorage.setItem('userId', profile.userId);
            localStorage.setItem('picture', profile.pictureUrl);

            getCid(profile.userId, profile.pictureUrl)


        }
        // getCid('U1b5792c2049b94a34abc87eedf946d2a', '')
        getData()
        // getPttype()
    }, [])

    const getCid = async (userId, pictureUrl) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-register-cid/${userId}`, { headers: { "token": token } })
            console.log(res.data)
            if (res.data.length > 0) {
                setHn(res.data[0].hn)
                setTname(res.data[0].tname)
                setTage(res.data[0].tage)
                localStorage.setItem('tname', res.data[0].tname);
                getHistoryResult(res.data[0].hn)



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

    const getHistoryResult = async (hn) => {
        console.log(hn)
        try {
            let res = await axios.get(`${BASE_URL}/get-history-result/${hn}`, { headers: { "token": token } })
            if (res.data.length > 0) {
                setData(res.data)


            }

            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {/* <Head>
                <title>ประวัติการตรวจ</title>
            </Head> */}
            <NavHeader />
            <div className='container' style={{ paddingTop: '17%' }}>
                {/* Profile */}
                <div style={{ backgroundColor: 'white', height: 110, borderRadius: 15 }} >


                    <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                        <div className='col-4'>
                            <img src={Object.keys(profile).length == 0 ? './images/user.gif' : profile.pictureUrl} width={80} height={80} style={{ borderRadius: '50%' }} />

                        </div>
                        <div className='col-8' >
                            <div className='row' style={{ fontSize: 15 }}>
                                ชื่อ-สกุล : {tname}
                            </div>
                            <div className='row' style={{ fontSize: 15, paddingTop: 8 }}>
                                HN : {hn}
                            </div>
                            <div className='row' style={{ fontSize: 15, paddingTop: 5 }}>
                                อายุ : {tage}  ปี
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profile */}

                <h6 style={{ color: 'black', paddingTop: 25 }}>ประวัติการจอง</h6>

                {isLoading ? <div className='text-center'> <Section><ReactLoading type='bubbles' color='#AAAAAA' height={'20%'} width={'20%'} /></Section></div> :



                    data.map((item, i) => {
                        return <div style={{ backgroundColor: 'white', height: 60, borderRadius: 15, marginBottom: 10 }} key={i} onClick={
                            () => window.open(`https://sw.srisangworn.go.th/webap/hosxp/reportHCA5.php?vn=${item.vn}`, '_blank')
                        }>
                            <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                                <div className='col-1'></div>
                                <div className='col-9'>
                                    <div className='row' style={{ fontSize: 15, }}>
                                        วันที่ตรวจ : {moment(item.vstdate).format('LL')}
                                    </div>
                                </div>
                                <div className='col-2' style={{ textAlign: 'left' }}>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                    </svg> */}
                                </div>
                            </div>
                        </div>
                    })



                }


            </div>
        </div>
    )
}

export default HistoryResult