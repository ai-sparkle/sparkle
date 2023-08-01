import React from 'react'
import { getIconColor } from './icon-color-helper'
import { IconObject } from './icon-util'

function Text({ scale, color = 'grey' }: IconObject) {
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
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                }}
            >
                <path
                    d="M18.25 7.25V5.75H5.75V7.25"
                    stroke={iconColor || undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                ></path>
                <path
                    d="M12 6V18.25M12 18.25H10.75M12 18.25H13.25"
                    stroke={iconColor || undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                ></path>
            </svg>
        </div>
    )
}

export default React.memo(Text)
