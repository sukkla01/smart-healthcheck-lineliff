import React, { useEffect, useState } from 'react'

const Myprofile = () => {

    const [profile, setProfile] = useState({})

    useEffect(() => {
        // console.log(i)
        localStorage.setItem('path', 'myprofile');
        async function getData() {
            const liff = (await import('@line/liff')).default
            await liff.ready
            const profile = await liff.getProfile()
            setProfile(profile)
        }

        getData()
    }, [])


    return (
        <div>
            <center>
                <h1>
                    Hi My ProFile
                </h1>
                <p>SubID : {profile.userId}</p>
                <p>Name : {profile.displayName}</p>
                <img style={{ width: 250 }} src={profile.pictureUrl}></img>
            </center>
        </div>
    )
}

export default Myprofile


