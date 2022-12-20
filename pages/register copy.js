import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader';
import { Button, Radio } from 'antd';

const Register = () => {
    const [pictureUrl, setPictureUrl] = useState('../images/user.png');
    const [idToken, setIdToken] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [userId, setUserId] = useState("");
    const [alertM, setUAlertm] = useState("");
    const [formData, setFormData] = useState(
        {
            cid: '',
            tel: ''
        })

    useEffect(() => {
        // console.log(i)
        localStorage.setItem('path', 'register');
        async function getData() {
            const liff = (await import('@line/liff')).default
            await liff.ready
            const profile = await liff.getProfile()
            setProfile(profile)
            setUserId(profile.userId)
        }

        getData()
    }, [])


    const submit =()=>{

    }

    return (
        <div style={{ textAlign: "center" }}>
            <NavHeader />

            <div id="wrap">
                <div className='text-center' style={{ marginTop: 100 }}>
                    <h4 style={{ color: '#3f51b5' }}>กรอกข้อมูลเพื่อสมัคร {userId}</h4>
                </div>

                <form>
                    <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 30 }}>
                        <img src={pictureUrl} width={100} height={100} style={{ borderRadius: '50%' }} />
                        <div className="form-group" style={{ marginTop: 30 }}>
                            <input type="text" value={formData.cid} name='cid' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="เลขบัตรประจำตัวประชาชน"
                                onChange={e => {
                                    // setIsCode(false)
                                    setFormData({ ...formData, cid: e.target.value })
                                    setUAlertm('')
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

                            />
                        </div>
                    </div>
                </form>
                <p style={{ color: 'red' }}>{alertM}</p>
            </div>

            <div>
                <img src='../images/3.png' />
            </div>
            <div id="footer" >
                <Button type="primary" shape="round" block size={'large'} onClick={submit} >
                    สมัครเข้าใช้งาน
                </Button>
                {/* <Button type="primary" shape="round" block size={'large'} onClick={logout} >
                    logout
                </Button> */}
            </div>
        </div>
    )
}

export default Register