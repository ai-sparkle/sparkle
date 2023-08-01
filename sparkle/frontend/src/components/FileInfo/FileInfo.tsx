import React from 'react'
import { FileObject } from '../LandingPage/LandingPage'
import Text from '../icons/Text'
import File from '../icons/File'
import Close from '../icons/Close'

interface FileInfoProps {
    fileObject: FileObject
    deleteFile: (id: number) => void
}

export const FileInfo: React.FC<FileInfoProps> = ({
    fileObject,
    deleteFile,
}) => {
    return (
        <div
            className="flex flex-row items-center"
            style={{
                borderBottom: '1px solid #D6D6D6',
                minHeight: '65px',
                width: '100%',
            }}
        >
            <div
                className="flex flex-row items-center"
                style={{ width: '90%', margin: '0 10px', overflow: 'hidden' }}
            >
                {fileObject.type === 'text' ? (
                    <Text scale={1.5} color="#367DE7" />
                ) : (
                    <File scale={1.5} color="#367DE7" />
                )}
                <div
                    style={{
                        marginLeft: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '250px',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {fileObject.type === 'text'
                        ? fileObject.text
                        : fileObject.file?.name}
                </div>
            </div>
            <div
                className="flex flex-row items-center"
                style={{
                    minWidth: '10%',
                    margin: '0 10px',
                    justifyContent: 'flex-end',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                onClick={() => deleteFile(fileObject.id)}
            >
                <Close scale={1.5} color="#9EA3AF" />
            </div>
        </div>
    )
}
