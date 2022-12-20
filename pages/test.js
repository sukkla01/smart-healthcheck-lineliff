import React, { useEffect, useState } from 'react'
import * as googleTTS from 'google-tts-api';
// const Audio = dynamic(import ('react-audioplayer'), { ssr: false })


const url = googleTTS.getAudioUrl('S002', {
    lang: 'th',
    slow: true,
    host: 'https://translate.google.com',
});

const Test = () => {
    const [loading, setLoading] = useState(true);
    const [audio] = useState(typeof Audio !== "undefined" && new Audio(url));

    useEffect(() => {
        audio.play()
    }, [])



    return (
        <div>

        </div>
    )
}

export default Test