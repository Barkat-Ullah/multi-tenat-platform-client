/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Collapse, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function FAQPage() {
  const faqs = [
    {
      key: '1',
      label: "What makes iRendity different from traditional real estate portals?",
      children: "iRendity is a vertical marketplace focused exclusively on income-producing assets. Unlike traditional portals that list all types of properties, we only showcase assets that are already leased, allowing investors to focus on cash flow and yield."
    },
    {
      key: '2',
      label: "Are the properties on iRendity already leased?",
      children: "Yes, every property listed on iRendity is sold with an active lease agreement in place. This ensures that investors gain immediate exposure to recurring income from the day of acquisition."
    },
    {
      key: '3',
      label: "Who can list properties on iRendity?",
      children: "We partner with professional real estate agencies that specialize in income-generating assets. Agencies benefit from highly targeted exposure to an audience of yield-oriented investors."
    },
    {
      key: '4',
      label: "What types of income-producing assets are available?",
      children: "Our marketplace features a range of commercial and residential assets across Italy, including retail spaces, offices, and residential units, all characterized by stable lease structures and measurable yields."
    },
    {
      key: '5',
      label: "How does iRendity support the investment process?",
      children: "We provide a structured environment where lease durations, guarantees, and yield calculations are transparently presented, enabling professional evaluation and direct connection with listing agencies."
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <Title level={2} className="text-center mb-10" style={{ color: '#1F2937', fontWeight: 700 }}>
          FAQ
        </Title>
        
        <Collapse
          accordion
          ghost
          expandIconPosition="end"
          expandIcon={({ isActive }) => isActive ? <MinusOutlined /> : <PlusOutlined />}
          items={faqs}
          className="faq-collapse"
          style={{ 
            background: 'transparent',
          }}
        />
      </div>
      
      <style jsx global>{`
        .faq-collapse .ant-collapse-item {
          margin-bottom: 16px;
          border: 1px solid #E5E7EB !important;
          border-radius: 8px !important;
          background: white !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .faq-collapse .ant-collapse-header {
          padding: 16px 24px !important;
          align-items: center !important;
        }
        .faq-collapse .ant-collapse-header-text {
          font-size: 18px !important;
          font-weight: 500 !important;
          color: #1F2937 !important;
        }
        .faq-collapse .ant-collapse-content-box {
          padding: 0 24px 16px 24px !important;
          color: #4B5563 !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
      `}</style>
    </section>
  );
}
