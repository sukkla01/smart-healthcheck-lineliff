import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader';
import { Button, Radio } from 'antd';
import { useRouter } from 'next/router'
import axios from 'axios'
import config from '../config'
import ReactLoading from 'react-loading';
import styled from "tachyons-components";
import LoadingSkeleton from '../component/LoadingSkeleton';

const BASE_URL = config.BASE_URL
const token = config.token

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;


const Register = () => {
    const router = useRouter()
    const [count, setCount] = useState(0)
    const [profile, setProfile] = useState({})
    const [alertM, setUAlertm] = useState("");
    const [status, setStatus] = useState("N");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(
        {
            cid: '',
            tel: ''
        })
    useEffect(() => {
        localStorage.setItem('path', 'register');
        async function getData() {
            const liff = (await import('@line/liff')).default
            await liff.ready
            const profile = await liff.getProfile()
            setProfile(profile)
            getCid(profile.userId)


        }
        // getData()
    }, [])



    const getCid = async (userId) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-register-cid/${userId}`, { headers: { "token": token } })
            setIsLoading(false)
            if (res.data.length > 0) {
                router.push({
                    pathname: '/register-success',
                    query: { userId: userId },
                })
            }

        } catch (error) {
            console.log(error)
        }
    }


    const submit = async () => {
        // e.preventDefault()

        let data = {
            cid: formData.cid,
            tel: formData.tel,
            userId: profile.userId,
            line_name: profile.displayName,
            picture: profile.pictureUrl
        }
        if (formData.cid == '' || formData.tel == '' || Object.keys(profile).length == 0) {
            setUAlertm('กรุณากรอกข้อมูลให้ครบ')
        } else {

            try {
                let res = await axios.get(`${BASE_URL}/get-hn/${formData.cid}`, { headers: { "token": token } })
                if (res.data.length == 0) {
                    setUAlertm('คุณยังไม่เคยมาโรงพยาบาลกรุณาติดต่อห้องบัตร')
                } else {
                    try {
                        let res = await axios.post(`${BASE_URL}/add-register`, data, { headers: { "token": token } })
                        console.log(res.data)
                        router.push('/success')
                    } catch (error) {
                        alert(error)
                    }
                }
            } catch (error) {
                alert(error)
            }







        }
    }

    return (
        <div style={{ textAlign: "center" }}>
            <NavHeader />

            <div style={{ paddingTop: '20%', textAlign: 'center' }}>

                {isLoading ? <div className='container' style={{ marginTop: 20 }}>
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                </div> :


                    <div style={{ backgroundColor: 'white', marginLeft: 10, marginRight: 10, height: 500, borderRadius: 15 }}>

                        <div className='text-center' style={{ marginTop: 0 }}>
                            <h4 style={{ color: '#3f51b5', paddingTop: 20 }}>ลงทะเบียนเข้าใช้งาน</h4>
                        </div>

                        <form>
                            <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 30 }}>
                                {console.log(Object.keys(profile).length)}
                                <img src={Object.keys(profile).length == 0 ? './images/user.gif' : profile.pictureUrl} width={80} height={80} style={{ borderRadius: '50%' }} />
                                <div className="form-group" style={{ marginTop: 30 }}>
                                    <input type="text" value={formData.cid} name='cid' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="เลขบัตรประจำตัวประชาชน"
                                        onChange={e => {
                                            // setIsCode(false)
                                            setFormData({ ...formData, cid: e.target.value })
                                            setUAlertm('')
                                        }}

                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                                console.log('dd')
                                                setUAlertm('กรอกเฉพาะตัวเลข')
                                            }
                                        }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginTop: 30 }}>
                                    <input type="text" value={formData.tel} name='tel' className="form-control" id="exampleInputPassword1" placeholder="เบอร์โทร"
                                        onChange={e => {
                                            // setIsCode(false)
                                            setFormData({ ...formData, tel: e.target.value })
                                            setUAlertm('')
                                        }}
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                                setUAlertm('กรอกเฉพาะตัวเลข')
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
                        <p style={{ color: 'red' }}>{alertM}</p>

                        <div style={{ marginTop: 50, marginLeft: 20, marginRight: 20, marginBottom: 100 }} >
                            <Button type={profile != {} ? "primary" : "default"} shape="round" block size={'large'} onClick={submit} >
                                สมัครเข้าใช้งาน
                            </Button>
                        </div>
                    </div>}
            </div>



        </div>
    )
}

export default Register