import React, { useEffect } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import { Button, Radio } from 'antd';

const ReservSuccess = (props) => {
    const router = useRouter()

    const browserTabcloseHandler = e => {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = "";
    };

    const closeWindows = async () => {
        const liff = (await import('@line/liff')).default
        await liff.ready
        liff.closeWindow()
    }
    return (
        <div>
            <NavHeader />
            <div style={{ paddingTop: '20%' }}>
                <div className='container'>

                    <div style={{ backgroundColor: 'white', height: 200, borderRadius: 15 }}>
                        <div className='text-center' style={{ marginTop: 0 }}>
                            <div style={{ fontSize: 17, paddingTop: 20, fontWeight: 'bold' }}>
                                จองเรียบร้อยแล้ว
                            </div>
                            <img src={'./images/shield.gif'} width={80} height={80} style={{ borderRadius: '50%', marginTop: 20 }} />
                        </div>

                    </div>
                    <Button type="danger" shape="round" block size={'large'} onClick={closeWindows} style={{ marginTop: 10 }} >
                        ปิด
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ReservSuccess