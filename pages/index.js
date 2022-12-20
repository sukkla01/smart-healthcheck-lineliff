import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Avatar, List, Skeleton, Switch } from 'antd';
import LoadingSkeleton from '../component/LoadingSkeleton'
import NavHeader from '../component/NavHeader'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryString = decodeURIComponent(window.location.search).replace("?liff.state=", "");
    const params = new URLSearchParams(queryString);
    let tkey = params.get('key');
    // alert(path)

    tkey == null ? '' : router.push(`/${tkey}`)



    // if (path == 'test') {
    //   router.push(`/test`)
    // }
    // else if (path == 'myprofile') {
    //   router.push('/myprofile')
    // }
    // else {
    //   router.push('/')
    // }
  }, [])
  return (
    // <div className='text-center'>กำลัง login.......</div>
    <>
      <NavHeader />
      <div className='container' style={{ marginTop: 20 }}>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    </>


  )
}
