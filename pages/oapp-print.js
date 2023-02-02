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

const OappPrint = () => {
    const router = useRouter();
    const [dataHeader, setDataHeader] = useState([]);
    const { no } = router.query

    useEffect(() => {


        getHeader()
       
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


    

    return (
        <div style={{ fontFamily: 'Sarabun', marginTop: 10, width: '100%' }}   >
            <div style={{ backgroundColor: 'white', width: '100%', height: 750, marginLeft: 10 }}>
                {/* <div style={{ marginLeft: 20, marginRight: 2, marginTop: 10 }}> */}
                <div style={{ paddingTop: 20, marginLeft: 20 }}>
                    <span style={{ fontSize: 17, fontWeight: 'bold' }}> บัตรนัดตรวจโรค โรงพยาบาลศรีสังวรสุโขทัย</span> <span style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 80 }}> </span>
                </div>
                <div style={{ marginTop: 7, marginBottom: 10, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>  คลินิก : อาชีวเวชกรรม </span>
                </div>
                <hr style={{ marginTop: 10, border: '1px solid  ' }} />
                <div style={{ marginTop: 10, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>ชื่อ  : </span> <span style={{ fontSize: 14 }}>   {dataHeader != undefined ? dataHeader.tname : ''} </span>  <span style={{ fontSize: 14, marginLeft: 100,fontWeight:'bold' }}> อายุ :  </span><span> {dataHeader != undefined ? dataHeader.tage : ''} ปี   </span>
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>HN : </span><span style={{ fontSize: 14 }}>   {dataHeader != undefined ? dataHeader.hn : ''} </span>
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 14, marginLeft: 0 }}><b>สิทธิการรักษา :</b>   </span><span style={{ fontSize: 14, marginLeft: 0 }}>   {dataHeader != undefined ? dataHeader.tp2name : ''}  </span>
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 'bold' }}> วันที่นัด  : </span> <span> {moment(dataHeader != undefined ? dataHeader.nextdate : '2022-01-01').format('LL')} </span>
                    {/* <span style={{ fontSize: 14, marginLeft: 130, fontWeight: 'bold' }}> เวลานัด  {moment(dataHeader != undefined ? dataHeader.nextdate : '00:00', "HH:mm").format("hh:mm")}-{moment(dataHeader != undefined ? dataHeader.endtime : '00:00', "HH:mm").format("hh:mm")} </span> */}
                </div>
                <div style={{ marginTop: 5, marginLeft: 20 }}>
                    <span style={{ fontSize: 15 }}> <b>เหตุผลการนัด</b>   </span> <span style={{ fontSize: 15 }}>  </span>
                </div>

                <hr style={{ marginTop: 10, border: '1px dashed  ' }} />
               






                {/* <button onClick={onPrint}>print</button> */}
                {/* </div> */}
            </div>

        </div>
    )
}

export default OappPrint