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

const BASE_URL = config.BASE_URL
const token = config.token

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;

const Pttype = () => {
    const router = useRouter()
    const [profile, setProfile] = useState({})
    const [test, setTest] = useState({ 'ss': 11 })
    const [selectId, setSelectId] = useState(0)
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
        // getCid('xxxx', '')
        getData()
        getPttype()
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

                // if(profile.pictureUrl != res.data[0].picture){
                //     let data = {
                //       picture : pictureUrl,
                //       userId :userId
                //     }
                //    await axios.post(`${BASE_URL}/update-register-picture`,data, { headers: { "token": token } })
                // }

                setIsLoading(false)

            } else {

                // router.push({
                //     pathname: '/register',
                //     query: { userId: userId },
                // })
            }




        } catch (error) {
            console.log(error)
        }
    }

    const getPttype = async (userId) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-pttype`, { headers: { "token": token } })
            console.log(res.data)
            if (res.data.length > 0) {
                setData(res.data)

            }
        } catch (error) {
            console.log(error)
        }
    }

    const onDep = (value) => {

        if (selectId != 0) {
            router.push({
                pathname: '/item',
                query: { dep: selectId},
            })
        }


    }
    return (
        <div>
             <Head>
        <title>My page title</title>
      </Head>
            <NavHeader />
            <div className='container' style={{ paddingTop: '17%' }}>

                {/* Profile */}
                <div style={{ backgroundColor: 'white', height: 110, borderRadius: 15 }}>
                    <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                        <div className='col-4'>
                            <img src={Object.keys(profile).length == 0 ? './images/user.gif' : profile.pictureUrl} width={80} height={80} style={{ borderRadius: '50%' }} />

                        </div>
                        <div className='col-8'>
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
               

                <h6 style={{ color: 'black', paddingTop: 25 }}>เลือกสิทธิการตรวจ</h6>

                {isLoading ? <div className='text-center'> <Section><ReactLoading type='bubbles' color='#AAAAAA' height={'20%'} width={'20%'} /></Section></div> :


                    <div className='row' >

                        {data.map((item, i) => {
                            return <div className='col-6 mt-2' key={i} >
                                <div onClick={() => setSelectId(item.id)} className='text-center' style={{ backgroundColor: 'white', height: 100, borderRadius: 15, borderColor: selectId == item.id ? '#00bfa5' : 'white', borderWidth: 1, borderStyle: 'solid' }}>
                                    {/* <div className='row'> */}
                                    <img src={'./images/hos.gif'} width={40} height={40} style={{ marginTop: 10 }} />
                                    <p style={{ paddingTop: 0, fontSize: 16 }}>{item.name}</p>
                                    {/* </div> */}
                                </div>
                            </div>
                        })}

                    </div>

                }
                {/* <div className="card green" style={{ marginTop: 50 }} onClick={() => onDep(1)}>
          <h1>แพทย์แผนไทย</h1>
        </div>
        <div className="card purple" style={{ marginTop: 50 }} onClick={() => onDep(2)}>
          <h1>ทันตกรรม</h1>
        </div> */}
            </div>
            {isLoading ? '' :
                <div style={{ marginTop: 30, marginLeft: 20, marginRight: 20, marginBottom: 100 }} >
                    <Button type={selectId != 0 ? "primary" : "default"} shape="round" block size={'large'} onClick={onDep} >
                        ถัดไป
                    </Button>
                </div>}

        </div>
    )
}

export default Pttype