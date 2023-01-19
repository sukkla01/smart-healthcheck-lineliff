import React, { useEffect, useState } from 'react'
// const Audio = dynamic(import ('react-audioplayer'), { ssr: false })
import axios from 'axios'


const Test = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // audio.play()
    }, [])


    const ontest = async () => {
        let data = {
            userid: 'U1b5792c2049b94a34abc87eedf946d2a'
        }

        try {
            let res = await axios.post(`https://webhook-smart-healthcheck.diligentsoftinter.com/confirm`, data, { headers: { "Content-Type": 'application/json' } })

        } catch (error) {
            console.log(error)
        }


    }

    return (
        <div>
            <button onClick={ontest}>ok</button>
        </div>
    )
}

export default Test