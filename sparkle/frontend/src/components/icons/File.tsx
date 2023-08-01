import React from 'react'
import { getIconColor } from './icon-color-helper'
import { IconObject } from './icon-util'

function File({ scale, color = 'grey' }: IconObject) {
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
                    d="M7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V9L14 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25Z"
                ></path>
                <path
                    stroke={iconColor || undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M18 9.25H13.75V5"
                ></path>
            </svg>
        </div>
    )
}

export default React.memo(File)
