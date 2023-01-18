import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import ProfilePage from '../component/ProfilePage'
import { Button, Checkbox, Divider, Row, Col, Card } from 'antd';
import axios from 'axios'
import config from '../config'
import ReactLoading from 'react-loading';
import styled from "tachyons-components";
import { Pagination } from 'react-bootstrap';

const BASE_URL = config.BASE_URL
const token = config.token

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;


const Item = () => {
    const router = useRouter()
    const [profile, setProfile] = useState({})
    const [hn, setHn] = useState('')
    const [tage, setTage] = useState('')
    const [tname, setTname] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [dataMain, setDataMain] = useState([])
    const [dataMainCheck, setDataMainCheck] = useState([])
    const [dataMore, setDataMore] = useState([])
    const [dataMoreCheck, setDataMoreCheck] = useState([])

    const [sumMain, setSumMain] = useState(0)
    const [sumMore, setSumMore] = useState(0)
    const [sumTotal, setSumTotal] = useState(0)


    const { dep } = router.query;

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

        if(dataMain.length > 0 && dataMore.length > 0){
           
        }
        // getPttype()
    }, [])

    const getCid = async (userId, pictureUrl) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-register-cid/${userId}`, { headers: { "token": token } })
            if (res.data.length > 0) {
                setHn(res.data[0].hn)
                setTname(res.data[0].tname)
                setTage(res.data[0].tage)
                getMain(res.data[0].tage)
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
            let tsum = 0
            res.data.map((r, i) => {
                if (age < 35) {
                    if (r.lower35 == 1) {
                        tmp.push(r.id)
                        tsum = tsum + parseInt(r.price)
                    }
                } else {

                    if (r.upper35 == 1) {
                        tmp.push(r.id)
                        tsum = tsum + parseInt(r.price)
                    }
                }
            })

            setSumMain(tsum)
            setDataMainCheck(tmp)
            setSumTotal(tsum)
            getMore()

        } catch (error) {
            console.log(error)
        }
    }

    const getMore = async (age) => {
        try {
            let res = await axios.get(`${BASE_URL}/get-item-more`, { headers: { "token": token } })
            setDataMore(res.data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const onChangeMain = (list) => {
        let tmp = 0
        list.map((val, i) => {
            const result = dataMain.filter((e) => e.id == val)
            tmp = tmp + parseInt(result[0].price)
        })
        setSumMain(tmp)
        setDataMainCheck(list)
        setSumTotal(tmp + sumMore)
    }

    // const onCheckAllChange = (e) => {
    //     setCheckedList(e.target.checked ? plainOptions : []);
    //     setIndeterminate(false);
    //     setCheckAll(e.target.checked);
    // };
    const onChangeMore = (list) => {

        let tmp = 0
        list.map((val, i) => {
            const result = dataMore.filter((e) => e.id == val)
            tmp = tmp + parseInt(result[0].price)
        })
        setSumMore(tmp)
        setDataMoreCheck(list)
        setSumTotal(tmp + sumMain)


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

                <h6 style={{ color: 'black', paddingTop: 25 }}>เลือกรายการที่ต้องการตรวจ</h6>

                {isLoading ? <div className='text-center'> <Section><ReactLoading type='bubbles' color='#AAAAAA' height={'20%'} width={'20%'} /></Section></div> :


                    <div className='row' >

                        <Card style={{ marginLeft: 10, width: '95%' }}>
                            <Row>
                                <Col span={24} style={{ marginBottom: 10, marginTop: -15 }}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>รายการตรวจหลัก</div>

                                </Col>

                            </Row>
                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>
                                    {/* <Checkbox   onChange={onCheckAllChange}  >
                                       
                                    </Checkbox> */}
                                    <b> รายการ</b>

                                </Col>
                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                    <b>ราคา</b>
                                </Col>

                            </Row>
                            <hr style={{ marginTop: 0, marginBottom: 8 }} />
                            {dataMainCheck.length > 0 ?
                                <Checkbox.Group style={{ width: '100%' }} onChange={onChangeMain} defaultValue={dataMainCheck}>
                                    <Row>
                                        {dataMain.map((item, i) => {

                                            return < >
                                                <Col span={20} style={{ marginBottom: 3 }} >
                                                    <Checkbox value={item.id}>{item.name}</Checkbox>
                                                </Col>
                                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                                    {item.price}
                                                </Col>
                                            </>
                                        })}



                                    </Row>
                                </Checkbox.Group>
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
                        <Card style={{ marginLeft: 10, width: '95%', marginTop: 10 }}>
                            <Row>
                                <Col span={24} style={{ marginBottom: 10, marginTop: -15 }}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>รายการตรวจเพิ่มเติม</div>

                                </Col>

                            </Row>

                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>
                                    {/* <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                        
                                    </Checkbox> */}
                                    <b> รายการ</b>

                                </Col>
                                <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                    <b>ราคา</b>
                                </Col>

                            </Row>
                            <hr style={{ marginTop: 0, marginBottom: 8 }} />
                            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeMore} >
                                <Row>
                                    {dataMore.map((item, i) => {

                                        return < >
                                            <Col span={20} style={{ marginBottom: 3 }} >
                                                <Checkbox value={item.id}>{item.name}</Checkbox>
                                            </Col>
                                            <Col span={4} style={{ marginBottom: 3, textAlign: 'right' }}>
                                                {item.price}
                                            </Col>
                                        </>
                                    })}

                                </Row>
                            </Checkbox.Group>
                            <hr />
                            <Row>
                                <Col span={20} style={{ marginBottom: 3 }}>

                                    <b> รวมค่าใช้จ่ายเพิ่มเติม (บาท)</b>


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
                                    pathname: '/pttype'
                                })
                            }} >
                                กลับ
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button type={"primary"} block shape="round" size={'large'} style={{ marginLeft: 5 }} onClick={() => {
                                console.log(dataMoreCheck)
                                router.push({
                                    pathname: '/app_date',
                                    query: { dep: dep,dataMainSend : dataMainCheck, dataMoreSend : dataMoreCheck},
                                })
                            }}>
                                ถัดไป
                            </Button>
                        </Col>
                    </Row>

                </div>}

        </div>
    )
}

export default Item