import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavHeader from "../component/NavHeader";
import ProfilePage from "../component/ProfilePage";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import { Calendar, Button } from "antd";
import { ConfigProvider, Alert } from "antd";
import th_TH from "antd/lib/locale/th_TH";
import axios from "axios";
import config from "../config";

const BASE_URL = config.BASE_URL;
const token = config.token;

const QueueDate = () => {
  const router = useRouter();
  const { dep, profile, tname, hn_ } = router.query;
  const [dateShow, setSDateShow] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [picture, setPicture] = useState("");
  const [hn, setHn] = useState("");
  const [IsNext, setIsNext] = useState(false);
  const [countSlot, setCountSlot] = useState(0);
  const [DataDepName, setDataDepName] = useState("");
  const [tday, setTday] = useState("");

  useEffect(() => {
    const d = new Date();
    let day = d.getDay();
    let d_c = moment(d).format("YYYY-MM-DD");
    if (day == 1 || day == 2) {
      setDate(d_c);
      setSDateShow(moment(d_c).add(543, "year").format("LL"));
      setIsNext(true);
    } else {
      setSDateShow("ไม่เปิดบริการ กรุณาเลือกวันอื่น");
    }

    getSlot();
    getDepId();
    // getData()
    // setName(localStorage.getItem('tname'))
    // setUserId(localStorage.getItem('userId'))
    // setPicture(localStorage.getItem('picture'))
    // setHn(localStorage.getItem('hn'))
    setName(tname);
    setUserId(JSON.parse(profile).userId);
    setPicture(JSON.parse(profile).pictureUrl);
    setHn(hn_);
  }, []);

  const getSlot = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/get-dep-slot-id-check/${dep}`, {
        headers: { token: token },
      });

      let tmp = res.data.length == 1 && res.data[0].ttime == null ? 0 : 2;
      setCountSlot(tmp);
      setTday(res.data[0].tday.split(","));
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDepId = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/get-dep-id/${dep}`, {
        headers: { token: token },
      });
      setDataDepName(res.data[0].name);
    } catch (error) {
      console.log(error);
    }
  };

  async function onPanelChange(value, mode) {
    let a = ["1", "2"];

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
    } else if (nextdate == "2022-11-28" && dep == "5") {
      setIsNext(false);
      setSDateShow("ไม่เปิดบริการ");
    } else if (nextdate == "2022-11-22" && dep == "1") {
      setIsNext(false);
      setSDateShow("ไม่เปิดบริการ");
    } else if (daySelectCheck > 0) {
      try {
        let res = await axios.get(
          `${BASE_URL}/get-dep-limit/${nextdate}/${dep}`,
          { headers: { token: token } }
        );
        console.log(res.data);
        if (res.data.length == 0) {
          setSDateShow(
            moment(value).add(543, "year").format("LL") + " --- จองได้"
          );
          setDate(moment(value).format("YYYY-MM-DD"));
          setIsNext(true);
        } else {
          if (parseInt(res.data[0].tcount) <= res.data[0].max_limit) {
            setSDateShow(moment(value).add(543, "year").format("LL"));
            setDate(moment(value).format("YYYY-MM-DD"));
            setIsNext(true);
          } else {
            setSDateShow("เต็มแล้ว");
            setIsNext(false);
          }
        }
        // setData(res.data)
      } catch (error) {
        console.log(error);
      }
    } else {
      setSDateShow("ไม่เปิดบริการ กรุณาเลือกวันอื่น");
      setIsNext(false);
    }
  }

  const onBack = () => {
    router.push({
      pathname: "/queue",
    });
  };

  const onNext = (value) => {
    let path = countSlot > 0 ? "/queue-time" : "/queue-success";
    if (IsNext) {
      router.push({
        pathname: path,
        query: {
          dep: dep,
          date: date,
          profile: profile,
          tname: tname,
          hn_: hn,
          time: "",
        },
      });
    }
  };

  return (
    <div>
      <NavHeader />

      <div style={{ paddingTop: "17%" }}>
        {/* Profile */}
        <div
          style={{
            backgroundColor: "white",
            marginLeft: 15,
            marginRight: 10,
            height: 110,
            borderRadius: 15,
          }}
        >
          <div className="row" style={{ paddingTop: 15, paddingLeft: 10 }}>
            <div className="col-4">
              <img
                src={picture}
                width={80}
                height={80}
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div className="col-8">
              <div className="row" style={{ fontSize: 15 }}>
                ชื่อ-สกุล : {name}
              </div>
              <div className="row" style={{ fontSize: 15, paddingTop: 10 }}>
                HN : {hn}
              </div>
            </div>
          </div>
        </div>
        {/* Profile */}

        <div style={{ marginTop: 10, marginLeft: 15, marginRight: 10 }}>
          <Alert
            message="เปิดบริการเฉพาะเวลา 17.00-19.00 น."
            type="info"
            showIcon
          />
        </div>

        <h6
          style={{
            color: "black",
            paddingTop: 15,
            paddingLeft: 20,
            paddingRight: 15,
          }}
        >
          เลือกวันที่จองคิว {"(" + DataDepName + ")"}
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
    </div>
  );
};

export default QueueDate;
