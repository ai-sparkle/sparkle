import React from 'react'
import { getIconColor } from './icon-color-helper'
import { IconObject } from './icon-util'

function Upload({ scale, color = 'grey' }: IconObject) {
    const iconColor = getIconColor(color)
    return (
        <div
            className="flex items-center content-center"
            style={{
                width: `${24 * scale}px`,
                height: `${24 * scale}px`,
            }}
        >
            <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                }}
            >
                <path
                    stroke={iconColor || undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.75 14.75V16.25C4.75 17.9069 6.09315 19.25 7.75 19.25H16.25C17.9069 19.25 19.25 17.9069 19.25 16.25V14.75"
                ></path>
                <path
                    stroke={iconColor || undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 14.25L12 5"
                ></path>
                <path
                    stroke={iconColor || undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8.75 8.25L12 4.75L15.25 8.25"
                ></path>
            </svg>
        </div>
    )
}

export default React.memo(Upload)
