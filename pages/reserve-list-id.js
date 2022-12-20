import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader';
import axios from 'axios'
import config from '../config'
import { useRouter } from 'next/router'
import QRCode from "react-qr-code";
import * as moment from 'moment';
import 'moment/locale/th';
moment.locale('th')

const BASE_URL = config.BASE_URL
const token = config.token

const ReserveListId = () => {
  const [data, setData] = useState([ ])
    const router = useRouter()
    const { vn } = router.query

    useEffect(() => {
        getCid()
    }, [])


    const getCid = async () => {
        try {
            let res = await axios.get(`${BASE_URL}/get-vn/${vn}`, { headers: { "token": token } })
            console.log(res.data)
            setData(res.data)
        } catch (error) {
            console.log(error) 
        }
    }

    
    

  return (
    <div style={{ textAlign: "center" }}>
            <NavHeader />
            {data.length > 0 ?
                <div style={{ paddingTop: '20%' }}>
                    <div style={{ backgroundColor: 'white', marginLeft: 10, marginRight: 10, height: 530, borderRadius: 15 }}>
                        <p></p>
                        <div className='text-center' style={{ marginTop: 0 }}>
                            <h4 style={{ color: '#3f51b5', paddingTop: 15 }}>รายละเอียดการจอง</h4>
                            <img src={data[0].picture} width={70} height={70} style={{ borderRadius: '50%', marginTop:5,marginBottom:20 }} />
                            <p style={{ marginTop:0,fontSize:16  }}>{data[0].tname}</p>
                            <p style={{ marginTop:-10,fontSize:16 }}>{data[0].hn}</p>
                            <p style={{ marginTop:-10,fontSize:30 }}>{data[0].queue}</p>

                            <p style={{ marginTop:2,fontSize:16  }}>วันที่จอง : {moment(data[0].nextdate).add(543, 'year').format('LL')}</p>
                            <p style={{ marginTop:-10,fontSize:16,marginBottom:20  }}>แผนก : {data[0].dname}</p>


                            <QRCode value={data[0].vn_reserve}  size ={120} />
                        </div>



                    </div>
                </div> : ''}



        </div>
  )
}

export default ReserveListId