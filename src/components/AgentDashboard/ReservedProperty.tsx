"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useCreateReservedPropertyMutation } from "@/redux/service/agent/propertiesApi";
import { Button, Card, Typography, Input, List, Space, Alert, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "sonner";

const { Title, Text } = Typography;

function getErrorMessage(err: unknown, fallback = "Failed to submit reserved property.") {
  if (typeof err === "object" && err !== null) {
    if ("data" in err) {
      const fetchErr = err as FetchBaseQueryError & { data?: { message?: string } };
      return fetchErr.data?.message || fallback;
    }
    if ("message" in err) {
      const serErr = err as SerializedError;
      return serErr.message || fallback;
    }
  }
  return fallback;
}

export interface ReservedPropertyHandle {
  submit: () => Promise<boolean>;
  isLoading: boolean;
}

const ReservedProperty = forwardRef<ReservedPropertyHandle>((props, ref) => {
  const [createReservedProperty, { isLoading }] = useCreateReservedPropertyMutation();

  const [propertyId, setPropertyId] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [reservedList, setReservedList] = useState<string[]>(["Ac", "Furniture"]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const savedId =
      localStorage.getItem("createdPropertyId") ||
      localStorage.getItem("propertyId") ||
      "";

    if (savedId) setPropertyId(savedId);
  }, []);

  const handleAdd = () => {
    const value = propertyName.trim();
    if (!value) {
      message.warning("Please enter a property name");
      return;
    }

    // prevent duplicates (case-insensitive)
    const exists = reservedList.some((x) => x.toLowerCase() === value.toLowerCase());
    if (exists) {
      message.warning("This item already exists in the list");
      setPropertyName("");
      return;
    }

    setReservedList((prev) => [...prev, value]);
    setPropertyName("");
    message.success("Item added successfully");
  };

  const handleRemove = (index: number) => {
    setReservedList((prev) => prev.filter((_, i) => i !== index));
    message.success("Item removed");
  };

  const validateForm = (): boolean => {
    if (!propertyId.trim()) {
      setSubmitError("Property ID is required.");
      return false;
    }
    if (reservedList.length === 0) {
      setSubmitError("Please add at least 1 reserved item.");
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
      propertyId: propertyId.trim(),
      name: reservedList.map((x) => x.trim()).filter(Boolean),
    };

    console.log("=== Reserved Property payload ===");
    console.log(payload);

    try {
      const res = await createReservedProperty(payload).unwrap();

      // Store form data for this step
      const stepData = {
        reservedList,
      };
      localStorage.setItem("reservedProperty", JSON.stringify(stepData));

      await toast.success(res?.message || "Reserved Property submitted.")
      return true;
    } catch (err: unknown) {
      console.log("Reserved submit error:", err);
      const msg = getErrorMessage(err);

      await toast.error(msg)

      setSubmitError(msg);
      return false;
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    isLoading
  }));

  return (
    <div className="font-inter" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#223355', marginBottom: 8 }}>
            Reserved Property
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Add items that are reserved with the property
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

        {/* Form Section */}
        <div style={{ marginBottom: 24 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Reserved Property List
              </Text>

              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="Reserved Property name"
                  size="large"
                  onPressEnter={handleAdd}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
                  style={{ backgroundColor: '#2B2B2B' }}
                >
                  Add
                </Button>
              </Space.Compact>
            </div>

            {/* List Display */}
            <Card size="small" style={{ background: '#f9f9f9' }}>
              {reservedList.length > 0 ? (
                <List
                  dataSource={reservedList}
                  renderItem={(item, index) => (
                    <List.Item
                      actions={[
                        <Button
                          key="remove"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemove(index)}
                          size="small"
                        >
                          Remove
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>{index + 1}.</Text>
                            <Text>{item}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                  style={{ background: 'transparent' }}
                />
              ) : (
                <Alert
                  message="No reserved properties yet"
                  type="info"
                  showIcon
                  style={{ background: 'transparent', border: 'none' }}
                />
              )}
            </Card>
          </Space>
        </div>

        {/* Error Display */}
        {submitError && (
          <Alert
            message={submitError}
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        {/* Note: Submit button removed as it will be triggered from parent */}
      </Card>
    </div>
  );
});

ReservedProperty.displayName = 'ReservedProperty';

export default ReservedProperty;