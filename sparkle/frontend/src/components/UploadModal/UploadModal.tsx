import React, { useState, useRef } from 'react'
import './UploadModal.css'
import Upload from '../icons/Upload'
import { FileInfo } from '../FileInfo/FileInfo'
import { FileObject } from '../LandingPage/LandingPage'

interface UploadModalProps {
    files: FileObject[]
    setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>
    sanitizeFiles: () => void
}

export default function UploadModal({
    files,
    setFiles,
    sanitizeFiles,
}: UploadModalProps) {
    const [text, setText] = useState('')

    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        fileInputRef.current && fileInputRef.current.click()
    }

    const handleFileUpload = (e: any) => {
        if (e.target.files) {
            const inputFiles = [...e.target.files]
            const formattedFiles: FileObject[] = []

            inputFiles.map((file: File) => {
                const fileObject = {
                    id: Date.now() + Math.random(),
                    type: 'file',
                    file: file,
                    text: null,
                    message: '',
                    errorMessage: '',
                }
                formattedFiles.push(fileObject)
            })

            setFiles((prevFiles) => [...prevFiles, ...formattedFiles])
        }
    }

    const deleteFile = (id: number) => {
        setFiles((prevFiles) => {
            return prevFiles.filter((file) => file.id !== id)
        })
    }

    const handleTextUpload = () => {
        if (text) {
            const textObject: FileObject = {
                id: Date.now() + Math.random(),
                type: 'text',
                file: null,
                text: text,
                message: '',
                errorMessage: '',
            }

            setFiles((prevFiles) => [...prevFiles, textObject])
            setText('')
        }
    }

    return (
        <div className="flex flex-col items-center Upload-modal-container">
            <input
                type="file"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.txt"
                multiple
            />
            <div
                className="flex flex-col content-center items-center"
                style={{
                    border: '1px solid #B6B6B6',
                    borderRadius: '4px',
                    width: '85%',
                    height: '150px',
                    margin: '20px',
                    cursor: 'pointer',
                }}
                onClick={handleUploadClick}
            >
                <div className="flex flex-col items-center content-center">
                    <Upload scale={1.5} color="#367DE7" />
                    <div style={{ margin: '10px 0' }}>Add your files</div>
                    <div style={{ fontSize: 'small' }}>.pdf, .txt</div>
                </div>
            </div>

            <div
                className="flex flex-row items-center"
                style={{ width: '85%' }}
            >
                <div
                    style={{
                        borderBottom: '1px solid #B6B6B6',
                        width: '50%',
                        height: '1px',
                    }}
                ></div>
                <span style={{ margin: '0 35px' }}>or</span>
                <div
                    style={{
                        borderBottom: '1px solid #B6B6B6',
                        width: '50%',
                        height: '1px',
                    }}
                ></div>
            </div>

            <div
                className="flex flex-col content-center items-center"
                style={{
                    borderRadius: '4px',
                    width: '85%',
                    height: '150px',
                    margin: '20px',
                }}
            >
                <div
                    style={{
                        border: '1px solid #B6B6B6',
                        borderBottom: 'none',
                        borderRadius: '4px 4px 0 0',
                        height: '80%',
                        width: '100%',
                    }}
                >
                    <textarea
                        placeholder="Enter text here"
                        style={{
                            height: '100%',
                            outline: 'none',
                            border: 'none',
                            padding: '10px 10px',
                            width: '100%',
                            resize: 'none',
                            overflow: 'auto',
                            fontFamily: 'inherit',
                            borderRadius: '4px',
                        }}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                    />
                </div>

                <button
                    style={{
                        backgroundColor: 'white',
                        color: '#367DE7',
                        border: '2px solid #367DE7',
                        borderBottomLeftRadius: '4px',
                        borderBottomRightRadius: '4px',
                        height: '20%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        cursor: 'pointer',
                    }}
                    onClick={handleTextUpload}
                >
                    Add
                </button>
            </div>

            {files && files.length > 0 && (
                <div
                    className="flex flex-col"
                    style={{
                        width: '85%',
                        height: '215px',
                        marginBottom: '20px',
                        overflowY: 'auto',
                    }}
                >
                    {files.map((file) => {
                        return (
                            <div key={file.id}>
                                <FileInfo
                                    fileObject={file}
                                    deleteFile={deleteFile}
                                />
                            </div>
                        )
                    })}
                </div>
            )}

            {files && files.length > 0 && (
                <button
                    style={{
                        width: '50%',
                        height: '40px',
                        backgroundColor: '#367DE7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        margin: '10px 0',
                    }}
                    onClick={sanitizeFiles}
                >
                    Clean your files!
                </button>
            )}
        </div>
    )
}
