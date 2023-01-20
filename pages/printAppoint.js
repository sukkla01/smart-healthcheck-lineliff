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
                        tmp_price_main = tmp_price_main +  parseInt(item.price)
                    } else {
                        tmp_more.push(item)
                        tmp_price_more = tmp_price_more +  parseInt(item.price)

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
        <div style={{ fontFamily: 'Sarabun', marginTop: 10, width: '100%' }}   >
            <div   style={{ backgroundColor: 'white', width: '100%', height: 750 }}>
                {/* <div style={{ marginLeft: 20, marginRight: 2, marginTop: 10 }}> */}
                   





                    {/* <button onClick={onPrint}>print</button> */}
                {/* </div> */}
            </div>

            <Button type="primary"  block size={'large'} style={{ marginTop: 10, marginBottom: 20 }} onClick={
                    () => router.push({
                        pathname: '/history-detail',
                        query: { no: no },
                    })
                }>
                    กลับ
                </Button>
        </div>
    )


}

export default PrintAppoint