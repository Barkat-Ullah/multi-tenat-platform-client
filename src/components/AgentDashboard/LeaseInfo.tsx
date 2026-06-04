"use client";

import { useCreateLeaseInfoMutation } from "@/redux/service/agent/propertiesApi";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Form, Input, Select, Card, Typography, Row, Col, Space, Alert } from "antd";
import { toast } from "sonner";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export interface LeaseInfoHandle {
  submit: () => Promise<boolean>;
  isLoading: boolean;
}

const LeaseInfo = forwardRef<LeaseInfoHandle>((props, ref) => {
  const [createLeaseInfo, { isLoading }] = useCreateLeaseInfoMutation();

  const [propertyId, setPropertyId] = useState("");

  //  Form states
  const [status, setStatus] = useState("");
  // active/inactive
  const [duration, setDuration] = useState("");
  // "12 months"
  const [type, setType] = useState("");
  // PRIVATE/COMPANY/...
  const [rentPerMonth, setRentPerMonth] = useState("");
  const [leaseRenewal, setLeaseRenewal] = useState("");
  // Yes/No
  const [leasedArea, setLeasedArea] = useState("");
  // string per backend
  const [specialClauses, setSpecialClauses] = useState("");

  const [guaranteeType, setGuaranteeType] = useState("");
  // BANK_GUARANTEE ...
  const [guaranteeAmount, setGuaranteeAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form] = Form.useForm();

  //  Get the propertyId from previous page result
  useEffect(() => {
    const id = localStorage.getItem("createdPropertyId");
    if (id) setPropertyId(id);
  }, []);

  const validateForm = (): boolean => {
    if (!propertyId) {
      setSubmitError("PropertyId missing. Create property first.");
      return false;
    }
    if (!status.trim()) {
      setSubmitError("Lease Status is required.");
      return false;
    }
    if (!duration.trim()) {
      setSubmitError("Duration is required.");
      return false;
    }
    if (!type.trim()) {
      setSubmitError("Tenant Type is required.");
      return false;
    }
    if (!rentPerMonth.trim()) {
      setSubmitError("Rent per month is required.");
      return false;
    }
    if (!leaseRenewal.trim()) {
      setSubmitError("Lease renewal option is required.");
      return false;
    }
    if (!leasedArea.trim()) {
      setSubmitError("Leased area is required.");
      return false;
    }
    if (!guaranteeType.trim()) {
      setSubmitError("Guarantee type is required.");
      return false;
    }
    if (!guaranteeAmount.trim()) {
      setSubmitError("Guarantee amount is required.");
      return false;
    }
    if (!depositAmount.trim()) {
      setSubmitError("Deposit amount is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<boolean> => {
    setSubmitError(null);

    if (!validateForm()) {
      return false;
    }

    const payload = {
      propertyId,
      status: status.trim(),
      duration: duration.trim(),
      type: type.trim(),
      rentPerMonth: toNumber(rentPerMonth),
      leaseRenewal: leaseRenewal === "Yes",
      leasedArea: leasedArea.trim(),
      specialClauses: specialClauses.trim() || undefined,
      guaranteeType: guaranteeType.trim(),
      guaranteeAmount: toNumber(guaranteeAmount),
      depositAmount: toNumber(depositAmount),
    };


    try {
      const res = await createLeaseInfo(payload).unwrap();

      if (res?.success) {
        // Store form data for this step
        const stepData = {
          status,
          duration,
          type,
          rentPerMonth,
          leaseRenewal,
          leasedArea,
          specialClauses,
          guaranteeType,
          guaranteeAmount,
          depositAmount,
        };
        localStorage.setItem("leaseInfo", JSON.stringify(stepData));

        await toast.success(res?.message || "Lease info saved successfully.")
        return true;
      } else {
        setSubmitError(res?.message || "Failed to save lease info.");
        return false;
      }
    } catch (err: any) {
      console.log("Lease submit error:", err);

      await toast.error(err?.data?.message || "Failed to submit lease info.")

      setSubmitError("Failed to submit lease info.");
      return false;
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    isLoading
  }));

  return (
    <div className="font-inter" style={{ maxWidth: 1200, margin: '0 auto',}}>
      <Card>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#223355', marginBottom: 8 }}>
            Lease & Tenant Info
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Provide details of the lease agreement and tenant information.
          </Text>
        </div>

        {/* optional propertyId display */}
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
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={[24, 12]}>
            {/* Left Column */}
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Lease Status */}
                <Form.Item
                  label={<Text strong>Lease Status</Text>}
                  required
                >
                  <Input
                    size="large"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="active"
                  />
                </Form.Item>

                {/* Tenant Type */}
                <Form.Item
                  label={<Text strong>Tenant Type</Text>}
                  required
                >
                  <Select
                    size="large"
                    value={type || undefined}
                    onChange={setType}
                    placeholder="Select tenant type"
                  >
                    <Option value="PRIVATE">PRIVATE</Option>
                    <Option value="COMPANY">COMPANY</Option>
                    <Option value="PUBLIC">PUBLIC</Option>
                    <Option value="AUTHORITY">AUTHORITY</Option>
                    <Option value="CHAIN">CHAIN</Option>
                    <Option value="OTHERS">OTHERS</Option>
                  </Select>
                </Form.Item>

                {/* Lease Renewal Option */}
                <Form.Item
                  label={<Text strong>Lease Renewal Option</Text>}
                  required
                >
                  <Select
                    size="large"
                    value={leaseRenewal || undefined}
                    onChange={setLeaseRenewal}
                    placeholder="Select option"
                  >
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </Form.Item>

                {/* Special Clauses */}
                <Form.Item label={<Text strong>Special Clauses</Text>}>
                  <TextArea
                    rows={3}
                    value={specialClauses}
                    onChange={(e) => setSpecialClauses(e.target.value)}
                    placeholder="Write here"
                  />
                </Form.Item>

                {/* Lease Guarantee Type */}
                <Form.Item
                  label={<Text strong>Lease Guarantee Type</Text>}
                  required
                >
                  <Select
                    size="large"
                    value={guaranteeType || undefined}
                    onChange={setGuaranteeType}
                    placeholder="Select guarantee type"
                  >
                    <Option value="NONE">NONE</Option>
                    <Option value="BANK_GUARANTEE">Bank Guarantee</Option>
                    <Option value="INSURANCE_BOND">Insurance Bond</Option>
                    <Option value="CORPORATE_GUARANTEE">Corporate Guarantee</Option>
                    <Option value="PERSONAL_GUARANTEE">Personal Guarantee</Option>
                  </Select>
                </Form.Item>

                {/* Deposit Amount */}
                <Form.Item
                  label={<Text strong>Deposit Amount (€)</Text>}
                  required
                >
                  <Input
                    size="large"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="25000"
                  />
                </Form.Item>
              </Space>
            </Col>

            {/* Right Column */}
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Contract Duration */}
                <Form.Item
                  label={<Text strong>Contract Duration</Text>}
                  required
                >
                  <Input
                    size="large"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="12 months"
                  />
                </Form.Item>

                {/* Rent Amount */}
                <Form.Item
                  label={<Text strong>Rent Amount (€ / month)</Text>}
                  required
                >
                  <Input
                    size="large"
                    type="number"
                    value={rentPerMonth}
                    onChange={(e) => setRentPerMonth(e.target.value)}
                    placeholder="20000"
                  />
                </Form.Item>

                {/* Leased Area */}
                <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                  <div className="w-full">
                    <Form.Item
                      label={<Text strong>Leased Area</Text>}
                      required
                      className="w-full"
                    >
                      <Select
                        size="large"
                        value={leasedArea || undefined}
                        onChange={setLeasedArea}
                        placeholder="Select leased area"
                        className="w-full"
                      >
                        <Option value="Fully leased">Fully leased</Option>
                        <Option value="Custom">Custom value</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="w-full">
                    {leasedArea === "Custom" && (
                      <Form.Item className="w-full mt-7">
                        <Input
                          size="large"
                          onChange={(e) => setLeasedArea(e.target.value)}
                          placeholder="Enter leased area (e.g. 100 sqm)"
                        />
                      </Form.Item>
                    )}
                  </div>
                </div>

                {/* Guarantee Amount */}
                <Form.Item
                  label={<Text strong>Guarantee Amount (€)</Text>}
                  required
                >
                  <Input
                    size="large"
                    type="number"
                    value={guaranteeAmount}
                    onChange={(e) => setGuaranteeAmount(e.target.value)}
                    placeholder="25000"
                  />
                </Form.Item>

                {/* Error Display */}
                {submitError && (
                  <Form.Item>
                    <Alert message={submitError} type="error" showIcon />
                  </Form.Item>
                )}

                {/* Note: Submit button removed as it will be triggered from parent */}
                <div style={{ height: 16 }} />
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
});

LeaseInfo.displayName = 'LeaseInfo';

export default LeaseInfo;