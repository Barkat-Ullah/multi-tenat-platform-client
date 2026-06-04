'use client'
import { FloatButton } from 'antd';
import React from 'react';

const ScrollToTopButton = () => {
    return (
        <div>
            <FloatButton.BackTop style={{ left: 24, right: 'auto' }} />
        </div>
    );
};

export default ScrollToTopButton;
