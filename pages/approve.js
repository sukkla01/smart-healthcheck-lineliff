import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import ProfilePage from '../component/ProfilePage'
import { Button, Checkbox, Divider, Row, Col, Card } from 'antd';
import axios from 'axios'
import config from '../config'
import ReactLoading from 'react-loading';
import styled from "tachyons-components";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");

const BASE_URL = config.BASE_URL
const token = config.token

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;

const ApproveA = () => {
    const router = useRouter()
    const [profile, setProfile] = useState({})
    const [hn, setHn] = useState('')
    const [tage, setTage] = useState('')
    const [depName, setDepName] = useState('')
    const [tname, setTname] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [dataMain, setDataMain] = useState([])
    const [dataMainCheck, setDataMainCheck] = useState([])
    const [dataMore, setDataMore] = useState([])
    const [dataMoreCheck, setDataMoreCheck] = useState([])

    const [sumMain, setSumMain] = useState(0)
    const [sumMore, setSumMore] = useState(0)
    const [sumTotal, setSumTotal] = useState(0)

    const { dep, dataMainSend, dataMoreSend ,selectdate } = router.query;

    useEffect(() => {

        localStorage.setItem('path', 'queue');
        async function getData() {
            const liff = (await import('@line/liff')).default
            await liff.ready
            const profile = await liff.getProfile()
            setProfile(profile)
            localStorage.setItem('name', profile.displayName);
            localStorage.setItem('userId', profile.userId);
            localStorage.setItem('picture', profile.pictureUrl);

            getCid(profile.userId, profile.pictureUrl)

        }
        // getCid('U1b5792c2049b94a34abc87eedf946d2a', '')
        // getMore()
        getData()
        getPttype()
    }, [])


    const getPttype = async (userId) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-pttype`, { headers: { "token": token } })
            if (res.data.length > 0) {
                const r = res.data.filter((e) => e.id == dep)
                setDepName(r[0].name)

            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCid = async (userId, pictureUrl) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-register-cid/${userId}`, { headers: { "token": token } })
            if (res.data.length > 0) {
                setHn(res.data[0].hn)
                setTname(res.data[0].tname)
                setTage(res.data[0].tage)
                getMain(res.data[0].tage)
                getMore()
                localStorage.setItem('tname', res.data[0].tname);

            } else {

                // router.push({
                //     pathname: '/register',
                //     query: { userId: userId },
                // })
            }




        } catch (error) {
            console.log(error)
        }
    }


    const getMain = async (age) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-item-pttype/${dep}`, { headers: { "token": token } })
            setDataMain(res.data)
            let tmp = []
            let tmp_price = 0
            let tmp_data = []
            // let d = dataMainSend.split(',')
            // console.log(dataMainSend)

            dataMainSend.map((val, i) => {
                const result = res.data.filter((e) => e.id == val)
                tmp_price = tmp_price + parseInt(result[0].price)
                tmp_data.push(result[0])
            })
            setDataMainCheck(tmp_data)
            setSumMain(tmp_price)
            getMore(tmp_price)




        } catch (error) {
            console.log(error)
            
        }
    }

    const getMore = async (val) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-item-more`, { headers: { "token": token } })
            setDataMore(res.data)
            let tmp_price = 0
            let tmp_data = []
            let tmp_dataMoreSend = []
            // let d = JSON.parse(dataMoreSend).split(',')
            if(typeof(dataMoreSend) == 'string'){
                let d = dataMoreSend.split(',')
                // tmp_dataMoreSend = dataMoreSend === '' ? [] : dataMoreSend
                tmp_dataMoreSend =  dataMoreSend === '' ? [] : dataMoreSend.split(',')
            }else{
                tmp_dataMoreSend = dataMoreSend
            }
            

            tmp_dataMoreSend.map((val, i) => {
                const result = res.data.filter((e) => e.id == val)
                tmp_price = tmp_price + parseInt(result[0].price)
                tmp_data.push(result[0])
            })
            setDataMoreCheck(tmp_data)
            setSumMore(tmp_price)
            setSumTotal(tmp_price + val)
            setIsLoading(false)


        } catch (error) {
            console.log(error)
        }
    }
    const submit = async () => {
        console.log(dataMainSend)
        console.log(dataMoreSend)
        let data = {
            dataMainSend :  dataMainSend,
            dataMoreSend :  dataMoreSend,
            date : selectdate,
            depsend : dep,
            profile : profile,
            hn : hn
        }

        try {
            let res = await axios.post(`${BASE_URL}/add-appoint`,data, { headers: { "token": token } })
            router.push({
                pathname: 'appoint-success',
            });
        
        } catch (error) {
            console.log(error)
        }


    }

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
                {/* detail */}
                <div style={{ backgroundColor: 'white', height: 90, borderRadius: 15,marginTop : 10 }}>
                    <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
                        <div className='col-1'>

                        </div>
                        <div className='col-11'>
                            <div className='row' style={{ fontSize: 15 }}>
                                สิทธิ : {depName}
                            </div>
                            <div className='row' style={{ fontSize: 15, paddingTop: 8 }}>
                                วันที่จอง  : { moment(selectdate).format('LL').replace('2023','2566')   }
                            </div>
                        </div>
                    </div>
                </div>
                {/* detail */}

                {isLoading ? <div className='text-center'>
                    <Section>
                        <ReactLoading type='bubbles' color='#AAAAAA' height={'20%'} width={'20%'} /></Section></div> :

                    <div className='row' >

                        <Card style={{ marginLeft: 10, width: '95%', marginTop: 15 }}>
                            <Row>
                                <Col span={24} style={{ marginBottom: 10, marginTop: -15 }}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>รายการตรวจหลัก</div>

                                </Col>

                            </Row>
                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>

                                    <b> รายการ</b>

                                </Col>
                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                    <b>ราคา</b>
                                </Col>

                            </Row>
                            <hr style={{ marginTop: 0, marginBottom: 8 }} />
                            {dataMainCheck.length > 0 ?
                                <Row>
                                    {dataMainCheck.map((item, i) => {

                                        return < >
                                            <Col span={20} style={{ marginBottom: 3 }} >
                                               {i+1 }. {item.name}
                                            </Col>
                                            <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                                {item.price}
                                            </Col>
                                        </>
                                    })}



                                </Row>
                                : ''}
                            <hr />
                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>

                                    <b> รวมค่าใช้จ่ายหลัก (บาท)</b>


                                </Col>
                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                    <b>{sumMain}</b>
                                </Col>

                            </Row>
                        </Card>

                        <Card style={{ marginLeft: 10, width: '95%', marginTop: 20 }}>
                            <Row>
                                <Col span={24} style={{ marginBottom: 10, marginTop: -15 }}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>รายการตรวจเพิ่ม</div>

                                </Col>

                            </Row>
                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>

                                    <b> รายการ</b>

                                </Col>
                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                    <b>ราคา</b>
                                </Col>

                            </Row>
                            <hr style={{ marginTop: 0, marginBottom: 8 }} />
                            {dataMoreCheck.length > 0 ?
                                <Row>
                                    {dataMoreCheck.map((item, i) => {

                                        return < >
                                            <Col span={20} style={{ marginBottom: 3 }} >
                                            {i+1 }. {item.name}
                                            </Col>
                                            <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                                {item.price}
                                            </Col>
                                        </>
                                    })}



                                </Row>
                                : 'ไม่มีตรวจเพิ่ม'}
                            <hr />
                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>

                                    <b> รวมค่าใช้จ่ายหลัก (บาท)</b>


                                </Col>
                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                    <b>{sumMore}</b>
                                </Col>

                            </Row>
                        </Card>


                        <Card style={{ marginLeft: 10, width: '95%', marginTop: 10 }}>
                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>

                                    <b style={{ fontSize: 18 }}> ค่าใช้จ่ายทั้งหมด (บาท)</b>


                                </Col>
                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                    <b style={{ fontSize: 18 }}>{sumTotal}</b>
                                </Col>

                            </Row>
                        </Card>


                    </div>

                }

            </div>
            {isLoading ? '' :
                <div style={{ marginTop: 30, marginLeft: 15, marginRight: 15, marginBottom: 100 }} >

                    <Row>
                        <Col span={12}>
                            <Button type={"default"} block shape="round" size={'large'} style={{ marginRight: 5 }} onClick={() => {
                                router.push({
                                    pathname: '/app_date',
                                    query: { dep: dep, dataMainSend: dataMainSend, dataMoreSend: dataMoreSend },
                                })
                            }} >
                                กลับ
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button type={"primary"} block shape="round" size={'large'} style={{ marginLeft: 5 }} onClick={submit} >
                                ยืนยัน
                            </Button>
                        </Col>
                    </Row>

                </div>}
        </div>
    )
}

export default ApproveA