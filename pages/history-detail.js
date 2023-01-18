import React, { useEffect, useState } from 'react'
import NavHeader from '../component/NavHeader'
import { useRouter } from 'next/router'
import ProfilePage from '../component/ProfilePage'
import { Button, Steps } from 'antd';
import axios from 'axios'
import config from '../config'
import ReactLoading from 'react-loading';
import styled from "tachyons-components";
import Head from 'next/head'
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");


const HistoryDetail = () => {
    const router = useRouter();
    const { no } = router.query;

  return (
    <div>no</div>
  )
}

export default HistoryDetail