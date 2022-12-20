import { useState, useEffect } from "react"
// const msg = SpeechSynthesisUtterance()

const Test2 = () => {
    const [ourText, setOurText] = useState("")
    const [voice, setVoice] = useState()

    // let msg = new SpeechSynthesisUtterance()
    useEffect(() => {
        window.speechSynthesis.addEventListener('voiceschanged',onVoiceChanged)
        const utterThis = new SpeechSynthesisUtterance();
        setVoice(utterThis)

        // utterance.text ='hello'
        // utterance.pitch = 1.5
        // utterance.volume = 0.5
        // utterance.rate = 8
        // utterance.lang='th-TH'
        // window.speechSynthesis.speak(utterance)
        // console.log(utterance)
    }, [])


    const onVoiceChanged=()=>{
        const voice = speechSynthesis.getVoices()
        console.log(voice)
    }

    const speechHandler = () => {
        voice.text = ourText
        voice.lang = 'ko-KR'
        window.speechSynthesis.speak(voice)
    }

    return (
        <div className='App'>
            <h1>React Text to Speech App</h1>
            <input
                type='text'
                value={ourText}
                placeholder='Enter Text'
                onChange={(e) => setOurText(e.target.value)}
            />
            <button onClick={() => speechHandler()}>SPEAK</button>
        </div>
    )
}

export default Test2