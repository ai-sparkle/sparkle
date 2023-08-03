import React from 'react'
import './NavHeader.css'
import logo from '../../logo.svg'

export default function NavHeader() {
    return (
        <div className="flex flex-row items-center content-center Nav-header">
            <div className="Nav-logo">
                {/* <img src={logo} alt="Logo" /> */}
                <img
                    src="https://p144.p3.n0.cdn.getcloudapp.com/items/rRuzDR8w/643e046b-5017-4beb-8a68-37f2c155099f.jpg?v=a67e850bed952d671b4995463f62d90a"
                    width="350px"
                />
            </div>
        </div>
    )
}
