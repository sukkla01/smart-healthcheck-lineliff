import React, { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import th_TH from "antd/lib/locale/th_TH";
import { useRouter } from "next/router";
import { PrinterOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const BASE_URL = config.BASE_URL;

// let oapp_id = '3183664'
const PrintAppoint = () => {
    const router = useRouter();
    const [dataHeader, setDataHeader] = useState([]);
    const [dataMain, setDataMain] = useState([]);
    const [dataMore, setDataMore] = useState([]);
    const { no } = router.query


    const onPrint = () => {
        window.print()
    }

    useEffect(() => {


        getHeader()
        getDataAppoint()
        // getLab()
        // getXray()


    }, [no]);

    const getHeader = async () => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-report-oapp-header/${no}`, {
                headers: { token: token },
            });
            console.log(res.data)
            setDataHeader(res.data[0]);
        } catch (error) {
            console.log(error);
        }
    };


    const getDataAppoint = async () => {
        const token = localStorage.getItem("token");

        let tmp_main = []
        let tmp_more = []
        let tmp_price_main = 0
        let tmp_price_more = 0
        try {
            let res = await axios.get(`${BASE_URL}/get-history-appoint-detail/${no}`, { headers: { "token": token } })
            if (res.data.length > 0) {
                console.log(res.data)
                res.data.map((item, i) => {
                    if (item.type_item == 'ปกติ') {
                        tmp_main.push(item)
                        tmp_price_main = tmp_price_main + parseInt(item.price)
                    } else {
                        tmp_more.push(item)
                        tmp_price_more = tmp_price_more + parseInt(item.price)

                    }
                })
                setDataMain(tmp_main)
                setDataMore(tmp_more)
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="Container" style={{ fontFamily: 'Sarabun', padding: 10 }}   >
            <div style={{ backgroundColor: 'white', width: '100%', height: 750 }}>
                <div style={{ paddingTop: 20, textAlign: 'left', marginLeft: 20  }}>
                    <span style={{ fontSize: 17, fontWeight: 'bold' }}> บัตรนัดตรวจสุขภาพ โรงพยาบาลศรีสังวรสุโขทัย</span>
                </div>
                <div style={{ marginTop: 7, marginBottom: 10, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>  คลินิก : อาชีวเวชกรรม </span>
                </div>
                <hr style={{ marginTop: 10, border: '1px solid  ' }} />
                <div style={{ marginTop: 10, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>ชื่อ </span> <span style={{ fontSize: 14 }}>   {dataHeader != undefined ? dataHeader.tname : ''} </span>  <span style={{ fontSize: 14, marginLeft: 100 }}> อายุ  {dataHeader != undefined ? dataHeader.tage : ''} ปี   </span>
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>HN</span><span style={{ fontSize: 14 }}>   {dataHeader != undefined ? dataHeader.hn : ''} </span>
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 14, marginLeft: 0 }}><b>สิทธิการรักษา</b>   </span><span style={{ fontSize: 14, marginLeft: 0 }}>   {dataHeader != undefined ? dataHeader.tp2name : ''}  </span>
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 14, marginLeft: 0 }}><b>สิทธิใช้ในการตรวจสุขภาพ </b>   </span><span style={{ fontSize: 14, marginLeft: 0 }}>   {dataHeader != undefined ? dataHeader.ptname : ''}  </span>
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 'bold' }}> วันที่นัด   {moment(dataHeader != undefined ? dataHeader.nextdate : '2022-01-01').format('LL')} </span>
                    {/* <span style={{ fontSize: 14, marginLeft: 130, fontWeight: 'bold' }}> เวลานัด  {moment(dataHeader != undefined ? dataHeader.nextdate : '00:00', "HH:mm").format("hh:mm")}-{moment(dataHeader != undefined ? dataHeader.endtime : '00:00', "HH:mm").format("hh:mm")} </span> */}
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 15 }}> <b>เหตุผลการนัด</b>   </span> <span style={{ fontSize: 15 }}>   ลงจองผ่าน Line</span>
                </div>

                <hr style={{ marginTop: 10, border: '1px dashed  ' }} />
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}><u>รายการตรวจ</u></span>
                </div>

                {dataMain.map((item, i) => {
                    return <div style={{ marginTop: 2, marginLeft: 20 }} key={i}>
                        <span style={{ fontSize: 15 }}>{i + 1}.{' ' + item.iname}</span>
                    </div>
                })}

                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}><u>ตรวจเพิ่ม</u></span>
                </div>

                {dataMore.map((item, i) => {
                    return <div style={{ marginTop: 2, marginLeft: 20 }} key={i}>
                        <span style={{ fontSize: 15 }}>{i + 1}.{' ' + item.iname}</span>
                    </div>
                })}







                {/* <button onClick={onPrint}>print</button> */}
                {/* </div> */}
            </div>

            <div style={{ width: '100%', marginTop: 10, marginBottom: 20 }}>
                <Button type="primary" block size={'large'} onClick={
                    () => router.push({
                        pathname: '/history-detail',
                        query: { no: no },
                    })
                }>
                    กลับ
                </Button>
            </div>
        </div>
    )


}

export default PrintAppoint