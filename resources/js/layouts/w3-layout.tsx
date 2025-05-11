import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {type SharedData } from '@/types';

interface W3LayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export default function W3Layout({ children, sidebar }: W3LayoutProps) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="w3-light-grey">
            {/* Navigation Menu */}
            { auth.user && 
            <div className="w3-bar w3-dark-grey w3-large">
                <button className="w3-bar-item w3-button" onClick={toggleSidebar}>
                    ☰ Menu
                </button>
                <a href="/" className="w3-bar-item w3-button">Home</a>
                <a href="/dashboard" className="w3-bar-item w3-button">Dashboard</a>
                <a href="/settings/profile" className="w3-bar-item w3-button">Profile</a>
                <a href="/logout" className="w3-bar-item w3-button w3-right">Logout</a>
            </div>
            }

            { !auth.user &&
            <div className="w3-bar w3-dark-grey w3-large">
                 <button className="w3-bar-item w3-button" onClick={toggleSidebar}>
                    <span className='w3-text-custom-yellow'>Wealth</span><span className='w3-text-custom-blue'>Craft</span>
                </button>
            </div>
            }

            <div className="w3-row">
                {/* Sidebar */}
                <div
                    className={`w3-sidebar w3-bar-block w3-animate-left ${isSidebarVisible ? 'w3-show' : 'w3-hide'}`}
                    style={{ width: '250px' }}
                >
                    {sidebar || (
                        <div>
                            <h4 className="w3-bar-item">Menu</h4>
                            <a href="/dashboard" className="w3-bar-item w3-button">Dashboard</a>
                            <a href="/portfolio" className="w3-bar-item w3-button">Portfolio</a>
                            <a href="/settings" className="w3-bar-item w3-button">Settings</a>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className={`w3-col ${isSidebarVisible ? 'm12 l12' : 'm12 l12'} w3-padding`}>
                    {children}
                </div>
            </div>
        </div>
    );
}