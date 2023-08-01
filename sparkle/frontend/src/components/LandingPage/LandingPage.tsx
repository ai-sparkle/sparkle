import React, { useState, useEffect } from 'react'
import NavHeader from '../NavHeader/NavHeader'
import UploadModal from '../UploadModal/UploadModal'
import microsoft from '../../microsoft.svg'
import { sanitizeData } from '../../util/requestUtil'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import './LandingPage.css'
import FileCheckmark from '../icons/FileCheckmark'
import Key from '../icons/Key'
import Download from '../icons/Download'

export interface FileObject {
    id: number
    type: string
    file: File | null
    text: string | null
    message: string
    errorMessage: string
}

interface MappingsObject {
    name: number
    phone_number: number
    email: number
}

const keyToName = {
    name: 'names',
    phone_number: 'phone numbers',
    email: 'email addresses',
}

export default function LandingPage() {
    const [processedFiles, setProcessedFiles] = useState(0)
    const [currentKey, setCurrentKey] = useState<keyof typeof keyToName>('name')
    const [zipFile, setZipFile] = useState<JSZip | null>(null)
    const [step, setStep] = useState(0)
    const [files, setFiles] = useState<FileObject[]>([])
    const [mappingsFound, setMappingsFound] = useState<MappingsObject>({
        name: 0,
        phone_number: 0,
        email: 0,
    })

    const cycleKeys = () => {
        let keys = Object.keys(keyToName) as (keyof typeof keyToName)[]
        let currentIndex = keys.indexOf(currentKey)
        let nextIndex = (currentIndex + 1) % keys.length
        setCurrentKey(keys[nextIndex])
    }

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null

        if (step === 1) {
            intervalId = setInterval(() => {
                cycleKeys()
            }, 500)
        } else if (intervalId) {
            clearInterval(intervalId)
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [step, currentKey])

    const sanitizeFiles = async () => {
        if (files && files.length) {
            setStep(1)
            const zip = new JSZip()
            let newMappingsFound: MappingsObject = { ...mappingsFound }
            try {
                for (let i = 0; i < files.length; i++) {
                    const res = await sanitizeData(files[i].text, files[i].file)

                    const fileName = files[i].file?.name + '_sanitized.txt'
                    const dictionaryFileName =
                        files[i].file?.name + '_sanitized_dictionary.txt'
                    const spanText = res.spans
                        .map((span: any) => JSON.stringify(span, null, 2))
                        .join('\n')
                    const sanitizedText = res.sanitized_text

                    res.spans.forEach((span: any) => {
                        if (Object.keys(keyToName).includes(span.type)) {
                            const key = span.type as keyof MappingsObject
                            newMappingsFound[key]++
                        }
                    })

                    zip.file(fileName, sanitizedText)
                    zip.file(dictionaryFileName, spanText)

                    setProcessedFiles(i + 1)
                }
                setMappingsFound(newMappingsFound)
                setStep(2)
            } catch (error) {
                console.error('Failed to sanitize files:', error)
            }
            setZipFile(zip)
        }
    }

    const downloadFiles = async () => {
        if (zipFile) {
            const blob = await zipFile.generateAsync({ type: 'blob' })
            saveAs(blob, 'sanitized_files.zip')
        } else {
            console.error('No files to download')
        }
    }

    return (
        <div className="flex flex-col items-center Landing-page">
            <NavHeader />
            {step === 0 && (
                <div>
                    <div
                        className="flex content-center items-center"
                        style={{
                            fontSize: 'xx-large',
                            fontWeight: '600',
                            margin: '10px 0',
                        }}
                    >
                        Make your data shine!
                    </div>
                    <UploadModal
                        files={files}
                        setFiles={setFiles}
                        sanitizeFiles={sanitizeFiles}
                    />
                </div>
            )}
            {step === 1 && (
                <>
                    <div
                        style={{
                            width: '60%',
                            height: '5%',
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            marginBottom: '30px',
                            border: '2px solid black',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${
                                    (processedFiles / files.length) * 100
                                }%`,
                                backgroundImage:
                                    'linear-gradient(90deg, #4FF4FF 0%, #4EFF4A 100%)',
                                borderRadius: '5px',
                                transition: 'width 0.4s ease',
                            }}
                        />
                    </div>
                    <div
                        className="flex flex-row"
                        style={{
                            fontWeight: '400',
                            marginBottom: '30px',
                        }}
                    >
                        <div
                            style={{ marginRight: '5px' }}
                        >{`Looking for`}</div>
                        <div className="flex flex-col">
                            <div>{keyToName[currentKey]}</div>
                            {Object.keys(keyToName)
                                .filter((key) => key !== currentKey)
                                .map((key) => (
                                    <div
                                        style={{ marginTop: '10px' }}
                                        key={key}
                                    >
                                        {
                                            keyToName[
                                                key as keyof typeof keyToName
                                            ]
                                        }
                                    </div>
                                ))}
                        </div>
                    </div>
                </>
            )}

            {step === 2 && (
                <div>
                    <div
                        className="flex content-center items-center"
                        style={{
                            fontSize: 'x-large',
                            fontWeight: '600',
                            margin: '10px 0',
                        }}
                    >
                        Done! Thank you for using sparkle.ai
                    </div>
                    <div className="flex flex-col content-center Download-modal">
                        <div
                            className="flex flex-row items-center content-center"
                            style={{
                                height: '50%',
                            }}
                        >
                            <div style={{ margin: '0 10px' }}>
                                <FileCheckmark scale={4} color={'#1AB700'} />
                            </div>
                            <div
                                className="flex flex-col"
                                style={{ margin: '0 10px', fontWeight: '500' }}
                            >
                                <div
                                    style={{
                                        margin: '10px 0',
                                        fontWeight: '500',
                                    }}
                                >
                                    We found and replaced
                                </div>

                                {Object.entries(mappingsFound).map(
                                    ([key, value]) => {
                                        return value > 0 ? (
                                            <div
                                                style={{
                                                    fontWeight: '400',
                                                    margin: '4px 0',
                                                }}
                                                key={key}
                                            >
                                                <span
                                                    style={{
                                                        color: '#1AB700',
                                                    }}
                                                >
                                                    {value}
                                                </span>{' '}
                                                {`${
                                                    keyToName[
                                                        key as keyof MappingsObject
                                                    ]
                                                }`}
                                            </div>
                                        ) : null
                                    }
                                )}
                            </div>
                        </div>
                        <div
                            className="flex flex-col items-center content-center"
                            style={{
                                backgroundColor: '#F5F5F5',
                                height: '50%',
                            }}
                        >
                            <div className="flex flex-row content-center items-center">
                                <FileCheckmark scale={2.5} color="#1AB700" />
                                <span
                                    style={{
                                        color: '#50698D',
                                        fontSize: 'x-large',
                                        margin: '0 10px',
                                    }}
                                >
                                    +
                                </span>
                                <Key scale={2.5} color="#1AB700" />
                            </div>
                            <div
                                className="flex items-center content-center"
                                style={{
                                    width: '70%',
                                    height: '20%',
                                    backgroundColor: '#1AB700',
                                    color: 'white',
                                    borderRadius: '4px',
                                    margin: '15px 0',
                                    cursor: 'pointer',
                                }}
                                onClick={downloadFiles}
                            >
                                <div style={{ marginRight: '5px' }}>
                                    <Download scale={1} color={'white'} />
                                </div>
                                Download sanitized file and dictionary
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="flex flex-col items-center content-center"
                style={{ margin: '10px 0' }}
            >
                <img src={microsoft} alt="microsoft" />
                <div style={{ fontSize: 'small', marginTop: '15px' }}>
                    Made by Storytell.ai
                </div>
            </div>
        </div>
    )
}
