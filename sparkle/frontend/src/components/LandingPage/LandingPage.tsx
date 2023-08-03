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
import Close from '../icons/Close'
import ProcessingLoadingText from '../ProcessingLoadingText/ProcessingLoadingText'

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
    const [denyList, setDenyList] = useState<string[]>([])
    const [allowList, setAllowList] = useState<string[]>([])
    const [currentAllowInput, setCurrentAllowInput] = useState('')
    const [currentDenyInput, setCurrentDenyInput] = useState('')
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

    console.log(allowList, denyList)

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null

        if (step === 2) {
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
            setStep(2)
            const zip = new JSZip()
            let newMappingsFound: MappingsObject = { ...mappingsFound }
            try {
                for (let i = 0; i < files.length; i++) {
                    const res = await sanitizeData(
                        files[i].text,
                        files[i].file,
                        allowList,
                        denyList
                    )

                    const fileName =
                        (files[i].file?.name || `text_upload_${i}`) +
                        '_sanitized.txt'
                    const dictionaryFileName =
                        (files[i].file?.name || `text_upload_${i}`) +
                        '_sanitized_dictionary.txt'

                    const spanText =
                        '[' +
                        res.spans
                            .map((span: any) => JSON.stringify(span, null, 2))
                            .join(',\n') +
                        ']'

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
                setStep(3)
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

    const handleKeyPressAllow = (event: any) => {
        if (event.key === 'Enter') {
            setAllowList((prevAllowList) => [
                ...prevAllowList,
                currentAllowInput,
            ])
            setCurrentAllowInput('')
        }
    }

    const handleKeyPressDeny = (event: any) => {
        if (event.key === 'Enter') {
            setDenyList((prevDenyList) => [...prevDenyList, currentDenyInput])
            setCurrentDenyInput('')
        }
    }

    return (
        <div className="flex flex-col items-center Landing-page">
            <NavHeader />
            {step === 0 && (
                <div>
                    {/* <div
                        className="flex content-center items-center"
                        style={{
                            fontSize: 'xx-large',
                            fontWeight: '600',
                            margin: '10px 0',
                        }}
                    >
                        Make your data shine!
                    </div> */}
                    <UploadModal
                        files={files}
                        setFiles={setFiles}
                        setStep={setStep}
                    />
                </div>
            )}
            {step === 1 && (
                <div
                    className="flex flex-col items-center"
                    style={{ width: '100%', marginBottom: '30px' }}
                >
                    <div
                        style={{
                            width: '350px',
                            textAlign: 'center',
                            fontSize: 'smaller',
                            marginBottom: '10px',
                        }}
                    >
                        {`Create your Whitelist and Blacklist. For convenience,
                        these lists are saved in your browser’s memory.`}
                    </div>
                    <div
                        className="flex flex-col items-center"
                        style={{
                            width: '25%',
                            height: '270px',
                            border: '1px solid black',
                            borderRadius: '4px',
                            margin: '10px 0',
                            minWidth: '500px',
                            minHeight: '400px',
                        }}
                    >
                        <div
                            className="flex flex-col"
                            style={{ width: '90%', height: '90%' }}
                        >
                            <div
                                className="flex flex-col"
                                style={{
                                    flexGrow: 1,
                                    paddingTop: '15px',
                                    overflowY: 'auto',
                                    height: '50%',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 'smaller',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {' '}
                                    {'Whitelist: never sanitize'}{' '}
                                </div>
                                <div
                                    style={{
                                        color: '#9EA3AF',
                                        fontSize: 'small',
                                    }}
                                >
                                    {' '}
                                    {'Never clean the words in this list'}{' '}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={currentAllowInput}
                                        onChange={(e) =>
                                            setCurrentAllowInput(e.target.value)
                                        }
                                        onKeyPress={handleKeyPressAllow}
                                        placeholder="Enter a term and press enter"
                                        style={{
                                            width: '100%',
                                            height: '45px',
                                            border: '1px solid #B6B6B6',
                                            borderRadius: '4px',
                                            color: '#6F6F6F',
                                            padding: '0 10px',
                                            outline: 'none',
                                            margin: '10px 0',
                                        }}
                                    />
                                </div>
                                {allowList && allowList.length > 0 && (
                                    <div
                                        className="flex flex-row"
                                        style={{
                                            width: '100%',
                                            height: '50px',
                                            overflowY: 'scroll',
                                            maxHeight: '150px',
                                        }}
                                    >
                                        {allowList.map((item, index) => {
                                            return (
                                                <div className="flex flex-row items-center Word-bubble">
                                                    <div>{item}</div>
                                                    <div
                                                        style={{
                                                            marginLeft: '5px',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            setAllowList(
                                                                (
                                                                    prevAllowList
                                                                ) =>
                                                                    prevAllowList.filter(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) =>
                                                                            i !==
                                                                            index
                                                                    )
                                                            )
                                                        }}
                                                    >
                                                        <Close
                                                            scale={0.9}
                                                            color="#367DE7"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                            <div
                                style={{ borderBottom: '1px solid #B6B6B6' }}
                            ></div>
                            <div
                                className="flex flex-col"
                                style={{
                                    flexGrow: 1,
                                    paddingTop: '15px',
                                    overflowY: 'auto',
                                    height: '50%',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 'smaller',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {' '}
                                    {'Blacklist: always sanitize'}{' '}
                                </div>
                                <div
                                    style={{
                                        color: '#9EA3AF',
                                        fontSize: 'small',
                                    }}
                                >
                                    {' '}
                                    {'Always clean the words in this list'}{' '}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={currentDenyInput}
                                        onChange={(e) =>
                                            setCurrentDenyInput(e.target.value)
                                        }
                                        onKeyPress={handleKeyPressDeny}
                                        placeholder="Enter a term and press enter"
                                        style={{
                                            width: '100%',
                                            height: '45px',
                                            border: '1px solid #B6B6B6',
                                            borderRadius: '4px',
                                            color: '#6F6F6F',
                                            padding: '0 10px',
                                            outline: 'none',
                                            margin: '10px 0',
                                        }}
                                    />
                                </div>
                                {denyList && denyList.length > 0 && (
                                    <div
                                        className="flex flex-row"
                                        style={{
                                            width: '100%',
                                            height: '50px', // Set a fixed height
                                            overflowY: 'scroll', // Allow vertical scrolling
                                            maxHeight: '150px', // Ensures the container doesn't grow
                                        }}
                                    >
                                        {denyList.map((item, index) => {
                                            return (
                                                <div className="flex flex-row items-center Word-bubble">
                                                    <div>{item}</div>
                                                    <div
                                                        style={{
                                                            marginLeft: '5px',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            setDenyList(
                                                                (
                                                                    prevDenyList
                                                                ) =>
                                                                    prevDenyList.filter(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) =>
                                                                            i !==
                                                                            index
                                                                    )
                                                            )
                                                        }}
                                                    >
                                                        <Close
                                                            scale={0.9}
                                                            color="#367DE7"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className="flex content-center items-center"
                            style={{
                                color: 'white',
                                backgroundColor: '#367DE7',
                                width: '45%',
                                fontSize: 'smaller',
                                borderRadius: '4px',
                                height: '40px',
                                marginBottom: '20px',
                                cursor: 'pointer',
                            }}
                            onClick={sanitizeFiles}
                        >
                            Sanitize files
                        </div>
                    </div>
                </div>
            )}
            {step === 2 && (
                <>
                    <div
                        style={{
                            width: '60%',
                            height: '45px',
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
                                minWidth: '40px',
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
                        <ProcessingLoadingText />
                    </div>
                </>
            )}

            {step === 3 && (
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

            {step === 0 ? (
                <div className="LandingPage-blogs-section flex flex-col items-center">
                    <div className="LandingPage-blogs flex flex-row">
                        <a
                            className="BlogCard"
                            href="https://www.web.storytell.ai/support/sparkle-ai/how-to-use-sparkle-ai"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="BlogCard-header">
                                <img
                                    width="100%"
                                    src="https://p36.tr2.n0.cdn.getcloudapp.com/items/z8ubog2B/3c9af249-d8c2-49a3-83af-b4530b1eb51c.jpg?v=71aab16a6021cd56eb748afed8d98a2c"
                                    alt=""
                                />
                            </div>
                            <div className="BlogCard-content">
                                <span>How to use Sparkle.ai</span>
                            </div>
                        </a>
                        <a
                            className="BlogCard"
                            href="https://www.web.storytell.ai/support/sparkle-ai/why-would-you-want-to-use-sparkle-ai"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="BlogCard-header">
                                <img
                                    width="100%"
                                    alt=""
                                    src="https://p36.tr2.n0.cdn.getcloudapp.com/items/lluXWlqd/c8a411b4-94ff-43b5-840c-3f87e2334f81.webp?v=23ed948ca45900d56264e7f079dae6b2"
                                />
                            </div>
                            <div className="BlogCard-content">
                                <span>
                                    Why would you want to use Sparkle.ai?
                                </span>
                            </div>
                        </a>
                        <a
                            className="BlogCard"
                            href="https://www.web.storytell.ai/support/sparkle-ai/why-storytell-created-sparkle-ai-as-an-oss-project-to-sanitize-enterprise-data-for-ai-use-cases"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="BlogCard-header">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/vCfwwmr8hUQ"
                                    title="Introducing Sparkle.ai - an open source data sanitization service for AI use cases"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="BlogCard-content">
                                <span>
                                    Why Storytell created Sparkle.ai as an OSS
                                    project to Sanitize Enterprise Data for AI
                                    use cases
                                </span>
                            </div>
                        </a>
                    </div>
                </div>
            ) : null}

            <div
                className="flex flex-col items-center content-center"
                style={{ margin: '20px 0' }}
            >
                {/* <img src={microsoft} alt="microsoft" /> */}
                <a
                    style={{ fontSize: 'small', marginTop: '15px' }}
                    href="https://storytell.ai"
                    target="_blank"
                    rel="noreferrer"
                >
                    Made with ❤️ by Storytell.ai
                </a>
            </div>
        </div>
    )
}
