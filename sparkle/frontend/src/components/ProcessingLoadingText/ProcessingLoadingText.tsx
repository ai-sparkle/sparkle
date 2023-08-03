import React, { useEffect, useState } from 'react'

import './ProcessingLoadingText.css'

export default function ProcessingLoadingText() {
    const words = [
        'names',
        'addresses',
        'phone numbers',
        'email addresses',
        'bank account numbers',
        'SSNs',
    ]

    const [currentWordInd, setCurrentWordInd] = useState(0)
    const [nextWordInd, setNextWordInd] = useState(1)
    const [animate, setAnimate] = useState(true)

    useEffect(() => {
        setInterval(() => {
            rotateWords()
        }, 2000)
    }, [])

    const rotateWords = () => {
        // setAnimate(false)
        setCurrentWordInd((i) => (i === words.length - 1 ? 0 : i + 1))
        setNextWordInd((i) => (i === words.length - 1 ? 0 : i + 1))
    }

    return (
        <span className="ProcessingLoadingText flex">
            Looking for{' '}
            <div
                className="ProcessingLoadingText-word-container"
                style={{ marginLeft: '6px', position: 'relative' }}
            >
                <div className="ProcessingLoadingText-word ProcessingLoadingText-current">
                    {words[currentWordInd]}
                </div>
                <div className="ProcessingLoadingText-word ProcessingLoadingText-next">
                    {words[nextWordInd]}
                </div>
            </div>
        </span>
    )
}
