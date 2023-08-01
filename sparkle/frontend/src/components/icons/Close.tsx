import React from 'react'
import { getIconColor } from './icon-color-helper'
import { IconObject } from './icon-util'

function Close({ scale, color = 'grey' }: IconObject) {
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
                    d="M17.25 6.75L6.75 17.25"
                ></path>
                <path
                    stroke={iconColor || undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6.75 6.75L17.25 17.25"
                ></path>
            </svg>
        </div>
    )
}

export default React.memo(Close)
