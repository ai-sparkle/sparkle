import React from 'react'
import './NavHeader.css'
import logo from '../../logo.svg'

export default function NavHeader() {
    return (
        <div className="flex flex-row items-center content-center Nav-header">
            <div className="Nav-logo">
                <img src={logo} alt="Logo" />
            </div>
        </div>
    )
}
