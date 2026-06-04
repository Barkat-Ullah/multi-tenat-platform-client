"use client"
import Link from 'next/link'
import { Result, Button, Space, Typography } from 'antd'
import {
    HomeOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
        }}>
            <div style={{
                maxWidth: 900,
                width: '100%',
                background: 'white',
                borderRadius: 16,
                padding: '48px 32px',
            }}>
                <Result
                    status="404"
                    title={
                        <Title level={1} style={{
                            fontSize: 120,
                            marginBottom: 0,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            404
                        </Title>
                    }
                    subTitle={
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={2} style={{ margin: 0 }}>
                                Oops! Page Not Found
                            </Title>
                            <Text type="secondary" style={{ fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
                                The page you are looking for might have been removed,
                                had its name changed, or is temporarily unavailable.
                            </Text>
                        </Space>
                    }
                    extra={
                        <Space size="middle" style={{ marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/" passHref>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<HomeOutlined />}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        minWidth: 140
                                    }}
                                >
                                    Back to Home
                                </Button>
                            </Link>

                        </Space>
                    }
                />


            </div>
        </div>
    )
}