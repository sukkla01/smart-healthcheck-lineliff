import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import axios from 'axios'
import config from '../config'
import moment from 'moment';
import ReactLoading from 'react-loading';
import styled from "tachyons-components";

const BASE_URL = config.BASE_URL
const token = config.token

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;

const Showq = () => {
    const router = useRouter()
    const [profile, setProfile] = useState({})
    const [data, setData] = useState([])
    const [hn, setHn] = useState('')
    const [q_current, setQcurrent] = useState('')
    const [tname, setTname] = useState('')
    const [ctime, setCtime] = useState('')
    const [next_time, setNextTime] = useState('')
    const [isLoading, setIsLoading] = useState(true);

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
        // getQueueName('0120257')
        getData()


        // const interval = setInterval(() => {
        //     getQueueName(hn)
        // }, 180000);
        // return () => clearInterval(interval);

    }, [])



    const getCid = async (userId, pictureUrl) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-register-cid/${userId}`, { headers: { "token": token } })
            if (res.data.length > 0) {
                setHn(res.data[0].hn)
                setTname(res.data[0].tname)
                getQueueName(res.data[0].hn)
                setIsLoading(false)

                const interval = setInterval(() => {
                    getQueueName(res.data[0].hn)
                }, 180000);
                return () => clearInterval(interval);

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


    const getQueueName = async (hn_) => {
        let tmp_hn = hn_ == '' ? hn : hn_
        // alert('hn = ' + hn)
        // alert('hn_ = ' + hn_)
        // alert('tmp_hn = ' + tmp_hn)

        let tmp1
        let tmp_current
        let tmp2
        let tmp_slot

        let minute_ = 0
        let regExp = /[^A-Z]/g;
        try {
            let res = await axios.get(`https://api-faststroke.diligentsoftinter.com/get-queue-person/${tmp_hn}`)
            if (res.data.length > 0) {
                tmp1 = res.data[0].current_queue.toUpperCase().replace(regExp, '')
                tmp_current = parseInt(res.data[0].current_queue.replace(tmp1, ''))
                tmp2 = res.data[0].queue_slot_number.toUpperCase().replace(regExp, '')
                tmp_slot = parseInt(res.data[0].queue_slot_number.replace(tmp2, ''))

                minute_ = (tmp_slot - tmp_current) * 5
                setData(res.data)
                // alert(res.data)
                // console.log(res.data[0].current_queue)
                // console.log(q_current)
                if (res.data[0].current_queue == q_current) {
                    // setNextTime
                    console.log('s')
                    // setNextTime(moment().add(20, 'minutes').format('HH:mm:ss'))
                } else {
                    setNextTime(moment().add(minute_, 'minutes').format('HH:mm:ss'))
                }
                setQcurrent(res.data[0].current_queue)
                setCtime(moment().format('HH:mm:ss'))
            }

            // console.log(tmp_current)




        } catch (error) {
            alert(error)
        }
    }

    const onRefresh = () => {

    }

    return (
        <div>
            <NavHeader />
            <div className='container' style={{ paddingTop: '17%' }}>
                <div style={{ backgroundColor: 'white', height: 110, borderRadius: 15 }}>
                    <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                        <div className='col-4'>
                            <img src={Object.keys(profile).length == 0 ? './images/user.gif' : profile.pictureUrl} width={80} height={80} style={{ borderRadius: '50%' }} />

                        </div>
                        <div className='col-8'>
                            <div className='row' style={{ fontSize: 15 }}>
                                ชื่อ-สกุล : {tname}
                            </div>
                            <div className='row' style={{ fontSize: 15, paddingTop: 10 }}>
                                HN : {hn}
                            </div>
                        </div>
                    </div>
                </div>


                {isLoading ? <div className='text-center'> <Section><ReactLoading type='bubbles' color='#AAAAAA' height={'20%'} width={'20%'} /></Section></div> :
                    data.map((item, i) => {
                        return <div style={{ backgroundColor: 'white', height: 330, border: 2, borderRadius: 15, marginTop: 10, textAlign: 'center' }} key={i}>
                            <div style={{ fontSize: 18, paddingTop: 10, fontWeight: 'bold' }}>{item.opd_qs_room_name}</div>
                            <div style={{ fontSize: 16, paddingTop: 10 }}>คิวปัจจุบัน / คิวของคุณ</div>
                            <div style={{ fontSize: 45, paddingTop: 5 }}> <span style={{ color: 'red' }}>{item.current_queue}</span> / <span style={{ color: 'green' }}>{item.queue_slot_number}</span></div>
                            <div style={{ fontSize: 12, paddingTop: 5 }}><i className="fa fa-refresh" style={{ fontSize: 14, paddingRight: 5 }} onClick={() => getQueueName(hn)}></i> ข้อมูล ณ : {ctime} น.</div>

                            <div style={{ fontSize: 16, paddingTop: 50 }}>เวลาประมาณถึงคิวของคุณ</div>
                            <div style={{ fontSize: 16, paddingTop: 5 }}>{next_time} น.</div>
                            <div style={{ fontSize: 16, paddingTop: 5 }}>** กรุณามารอก่อน 20 นาที **</div>

                        </div>
                    })}

                {isLoading ? '' : data.length == 0 ? <div className='text-center mt-5'>ไม่มีคิวในวันนี้ กรุณาติดต่อห้องบัตร</div> : ''}






            </div>
        </div>
    )
}

export default Showq