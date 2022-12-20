import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { Input, Button } from 'antd';
import axios from 'axios'
import config from '../config'
import { useRouter } from 'next/router'
import LoadingSkeleton from '../component/LoadingSkeleton';

const BASE_URL = config.BASE_URL
const token = config.token

const { TextArea } = Input;

const Problem = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({ detail: '', tel: '', user_id: '' })
    const [alertM, setUAlertm] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        localStorage.setItem('path', 'problem');
        async function getData() {
            const liff = (await import('@line/liff')).default
            await liff.ready
            const profile = await liff.getProfile()
            // setProfile(profile)
            setFormData({ ...formData, user_id : profile.userId })
            // setFormData({...formData,user_id : profile.userId})
            setIsLoading(false)

        }
        getData()
    }, [])

    const onOk = async () => {
        try {
            let res = await axios.post(`${BASE_URL}/add-problem`, formData, { headers: { "token": token } })
            router.push({
                pathname: '/problem-success'
            })
            // if (res.data.length > 0) {
            //     router.push({
            //         pathname: '/register-success',
            //         query: { userId: userId },
            //     })
            // }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <NavHeader />

            <div style={{ paddingTop: '17%', textAlign: 'center' }}>
                {isLoading ? <div className='container' style={{ marginTop: 20 }}>
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                </div> :
                    <div style={{ backgroundColor: 'white', marginLeft: 10, marginRight: 10, height: 330, borderRadius: 15 }}>
                        <p style={{ fontSize: 18, paddingTop: 20 }}>แจ้งปัญหาใช้งาน</p>

                        <div className='container'>
                            <TextArea onChange={e => {
                                // setIsCode(false)
                                setFormData({ ...formData, detail: e.target.value })
                                setUAlertm('')
                            }} value={formData.detail} rows={4} placeholder="กรอกข้อมูลปัญหาที่ต้องการแจ้ง" />
                            <Input onChange={e => {
                                // setIsCode(false)
                                setFormData({ ...formData, tel: e.target.value })
                                setUAlertm('')
                            }}

                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                        console.log('dd')
                                        setUAlertm('กรอกเฉพาะตัวเลข')
                                    }
                                }}
                                value={formData.tel} style={{ marginTop: 20 }} placeholder="เบอร์โทรติตด่อ" />
                            <Button type="primary" block size={'large'} onClick={onOk} style={{ marginTop: 20 }} >
                                บันทึก
                            </Button>
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default Problem