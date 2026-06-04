'use client'
import { FloatButton } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const AiToggleButton = () => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.accessToken);

    const handleClick = () => {
        if (token) {
            router.push('/ai-chat');
        } else {
            router.push('/login');
        }
    };

    return (
        <FloatButton
            icon={<CommentOutlined />} // or use RobotOutlined, CommentOutlined
            type="primary"
            style={{ right: 24}} // Position above the scroll button
            onClick={handleClick}
            tooltip="AI Chatbot"
        />
    );
};

export default AiToggleButton;
