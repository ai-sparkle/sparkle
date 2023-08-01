import React from 'react'
import { getIconColor } from './icon-color-helper'
import { IconObject } from './icon-util'

function FileCheckmark({ scale, color = 'grey' }: IconObject) {
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
                xmlns="http://www.w3.org/2000/svg"
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
                    d="M12.75 4.75h-5a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h3.5m1.5-14.5v3.5a2 2 0 0 0 2 2h3.5m-5.5-5.5 5.5 5.5m0 0v1m1 3.5s-1.929 2.09-2.893 4.5l-1.607-1.929"
                ></path>
            </svg>
        </div>
    )
}

export default React.memo(FileCheckmark)
