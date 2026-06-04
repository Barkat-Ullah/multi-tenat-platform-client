"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useCreateOptionalInvestmentMutation } from "@/redux/service/agent/propertiesApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Form, Input, Card, Typography, Row, Col, Space, Alert } from "antd";

const { Title, Text } = Typography;

export type OptionalInvestmentHandle = {
  submit: () => Promise<boolean>; // parent will call this
  isSubmitting: boolean;
};

type ApiErrorShape = { message?: string };

const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function getErrorMessage(err: unknown) {
  const e = err as FetchBaseQueryError;

  if (e && typeof e === "object" && "data" in e) {
    const data = e.data as ApiErrorShape | string | undefined;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
  }
  return "Failed to submit optional investment data.";
}

const OptionalInvestment = forwardRef<OptionalInvestmentHandle>(function OptionalInvestment(
  _props,
  ref
) {
  const [createOptionalInvestment, { isLoading }] =
    useCreateOptionalInvestmentMutation();

  const [propertyId, setPropertyId] = useState("");

  const [historicalRate, setHistoricalRate] = useState("");
  const [holdingPeriod, setHoldingPeriod] = useState("");
  const [sellingCost, setSellingCost] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedPropertyId =
      localStorage.getItem("createdPropertyId") ||
      localStorage.getItem("propertyId") ||
      "";
    if (savedPropertyId) setPropertyId(savedPropertyId);
  }, []);

  const validateForm = (): boolean => {
    if (!propertyId) {
      setSubmitError("Property ID not found. Please create property first.");
      return false;
    }

    if (!historicalRate.trim()) {
      setSubmitError("Historical Occupancy Rate is required.");
      return false;
    }
    if (!holdingPeriod.trim()) {
      setSubmitError("Holding Period is required.");
      return false;
    }
    if (!sellingCost.trim()) {
      setSubmitError("Selling Costs is required.");
      return false;
    }
    return true;
  };

  const submit = async () => {
    setSubmitError(null);

    if (!validateForm()) {
      return false;
    }

    const payload = {
      propertyId,
      historicalRate: toNumber(historicalRate),
      holdingPeriod: toNumber(holdingPeriod),
      sellingCost: toNumber(sellingCost),
    };


    try {
      const res = await createOptionalInvestment(payload).unwrap();

      // Store form data for this step
      const stepData = {
        historicalRate,
        holdingPeriod,
        sellingCost,
      };
      localStorage.setItem("optionalInvestment", JSON.stringify(stepData));

      if (res?.success) return true;

      setSubmitError(res?.message || "Failed to submit optional investment data.");
      return false;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      console.log("Optional investment submit error:", err);
      setSubmitError(msg);
      return false;
    }
  };

  //  expose functions to parent
  useImperativeHandle(ref, () => ({
    submit,
    isSubmitting: isLoading,
  }));

  return (
    <div className="font-inter" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#223355', marginBottom: 8 }}>
            Optional Investment Data
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Submit optional financial and investment information for deeper insights.
          </Text>
        </div>

        {/* Property ID Display */}
        {/* {propertyId && (
          <Alert
            message={
              <Text>
                Property ID: <Text strong>{propertyId}</Text>
              </Text>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )} */}

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={[24, 24]}>
            {/* Left Column */}
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Historical Occupancy Rate */}
                <Form.Item
                  label={<Text strong>Historical Occupancy Rate</Text>}
                  required
                >
                  <Input
                    size="large"
                    type="number"
                    value={historicalRate}
                    onChange={(e) => setHistoricalRate(e.target.value)}
                    placeholder="Enter amount"
                  />
                </Form.Item>

                {/* Selling Costs */}
                <Form.Item
                  label={<Text strong>Selling Costs (€)</Text>}
                  required
                >
                  <Input
                    size="large"
                    type="number"
                    value={sellingCost}
                    onChange={(e) => setSellingCost(e.target.value)}
                    placeholder="Enter amount"
                  />
                </Form.Item>
              </Space>
            </Col>

            {/* Right Column */}
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Holding Period */}
                <Form.Item
                  label={<Text strong>Holding Period (years)</Text>}
                  required
                >
                  <Input
                    size="large"
                    type="number"
                    value={holdingPeriod}
                    onChange={(e) => setHoldingPeriod(e.target.value)}
                    placeholder="Enter year"
                  />
                </Form.Item>

                {/* Empty space for alignment */}
                <div style={{ height: 56 }} />
              </Space>
            </Col>
          </Row>

          {/* Error Display */}
          {submitError && (
            <Alert
              message={submitError}
              type="error"
              showIcon
              style={{ marginTop: 24 }}
            />
          )}
        </Form>
      </Card>
    </div>
  );
});

export default OptionalInvestment;