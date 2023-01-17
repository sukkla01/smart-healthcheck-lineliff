import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import axios from 'axios'
import config from '../config'
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import { Calendar, Button } from "antd";
import { ConfigProvider, Alert } from "antd";
import th_TH from "antd/lib/locale/th_TH";

const BASE_URL = config.BASE_URL
const token = config.token


const AppDate = () => {
    const router = useRouter();
    // const { dep, profile, tname, hn_ } = router.query;
    const [dateShow, setSDateShow] = useState("");
    const [date, setDate] = useState("");
    const [hn, setHn] = useState("");
    const [IsNext, setIsNext] = useState(false);
    const [countSlot, setCountSlot] = useState(0);
    const [DataDepName, setDataDepName] = useState("");
    const [tday, setTday] = useState("");
    const [tage, setTage] = useState('')
    const [profile, setProfile] = useState({})
    const [tname, setTname] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const { dep, dataMainSend, dataMoreSend } = router.query;




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
        // getCid('U1b5792c2049b94a34abc87eedf946d2a', '')
        getData()
        // getPttype()
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
                setIsLoading(false)

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

    async function onPanelChange(value, mode) {

        const d = new Date(value);
        const now_ = new Date();
        let day = d.getDay();
        let nextdate = moment(value).format("YYYY-MM-DD");

        let daySelectCheck = tday.find((id) => id === day.toString());
        // date diff
        let start = moment(value, "YYYY-MM-DD");
        let end = moment(moment(now_).format("YYYY-MM-DD"), "YYYY-MM-DD");

        let tmp = moment.duration(start.diff(end)).asDays();

        if (tmp < 0) {
            setSDateShow("ไม่สามารถจองย้อนหลังได้ กรุณาเลือกวันอื่น");
            setIsNext(false);
        } else {
            setSDateShow(
                moment(value).add(543, "year").format("LL") + " --- จองได้"
            );
            setDate(nextdate)
            setIsNext(true);
        }

    }

    const onBack = () => {
        router.push({
            pathname: "/item",
            query: { dep: dep },
        });
    };

    const onNext = (value) => {
        let path = countSlot > 0 ? "/queue-time" : "/queue-success";
        if (IsNext) {
            router.push({
                pathname: 'approve',
                query: { dep: dep, dataMainSend: JSON.stringify(dataMainCheck), dataMoreSend: JSON.stringify(dataMoreCheck), selectdate: date },
            });
        }
    };
    return (
        <div>
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
            </div>


            <h6
                style={{
                    color: "black",
                    paddingTop: 15,
                    paddingLeft: 20,
                    paddingRight: 15,
                }}
            >
                เลือกวันที่ต้องการตรวจ {"(" + DataDepName + ")"}
            </h6>

            <div
                className="site-calendar-demo-card"
                style={{ marginLeft: 15, marginRight: 10, borderRadius: 15 }}
            >
                <ConfigProvider locale={th_TH}>
                    <Calendar
                        fullscreen={false}
                        onPanelChange={onPanelChange}
                        onChange={onPanelChange}
                        locale="th_TH"
                    />
                </ConfigProvider>
            </div>

            <div style={{ marginTop: 15, marginLeft: 15, marginRight: 10 }}>
                <p style={{ fontSize: 20 }} className="text-center">
                    <Alert
                        message={dateShow}
                        type={!IsNext ? "error" : "success"}
                        showIcon
                    />
                </p>
            </div>

            <div
                className="row"
                style={{
                    marginTop: 30,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 200,
                }}
            >
                <div className="col-6" style={{ marginBottom: 100 }}>
                    <Button
                        type={"default"}
                        shape="round"
                        block
                        size={"large"}
                        onClick={onBack}
                    >
                        กลับ
                    </Button>
                </div>
                <div className="col-6">
                    <Button
                        type={"primary"}
                        shape="round"
                        block
                        size={"large"}
                        onClick={onNext}
                    >
                        ถัดไป
                    </Button>
                </div>
            </div>
        </div>

    )
}

export default AppDate