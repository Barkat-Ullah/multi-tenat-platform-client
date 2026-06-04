/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { appAlert } from "@/utils/appAlert";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useCreateReservedPropertyMutation } from "@/redux/service/agent/propertiesApi";
import { Button, Card, Typography, Input, List, Space, Alert, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

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

export default function EditReservedProperty({ propertyData }: any) {
  const [createReservedProperty, { isLoading }] = useCreateReservedPropertyMutation();

  const [propertyId, setPropertyId] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [reservedList, setReservedList] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ✅ Populate with existing data
  useEffect(() => {
    if (propertyData?.data) {
      const data = propertyData.data;
      setPropertyId(data.id || "");

      if (data.reservedProperty?.name) {
        setReservedList(data.reservedProperty.name);
      }
    }
  }, [propertyData?.data]);

  const handleAdd = () => {
    const value = propertyName.trim();
    if (!value) {
      message.warning("Please enter a property name");
      return;
    }

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

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!propertyId) {
      setSubmitError("Property ID is required.");
      return;
    }

    const payload = {
      propertyId: propertyId.trim(),
      name: reservedList.map((x) => x.trim()).filter(Boolean),
    };

    try {
      const res = await createReservedProperty(payload).unwrap();
      appAlert.fire({
        title: "Success!",
        text: res?.message || "Reserved Property updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      appAlert.fire({
        title: "Error!",
        text: msg,
        icon: "error",
        confirmButtonText: "OK",
      });
      setSubmitError(msg);
    }
  };

  return (
    <div className="font-inter">
      <div className="text-center mb-7">
        <h2 className="text-2xl md:text-3xl font-lato font-semibold text-[#223355] mb-2">
          Reserved Property
        </h2>
        <p className="text-[#003944] text-sm md:text-[18px] font-medium mb-8">
          Add or remove items that are reserved with the property.
        </p>
      </div>

      {propertyId && (
        <p className="text-sm text-gray-600 mb-4 text-center">
          Property ID: <span className="font-medium">{propertyId}</span>
        </p>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Card className="border border-[#D4D4D4] rounded-lg">
          <div className="mb-6">
            <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
              Reserved Property List
            </label>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. AC, Furniture, etc."
                size="large"
                onPressEnter={handleAdd}
                className="bg-[#F8F8F6] border-[#D4D4D4]"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                size="large"
                className="bg-[#004E60] hover:bg-[#003a48]"
              >
                Add
              </Button>
            </Space.Compact>
          </div>

          <div className="bg-[#F8F8F6] rounded-lg p-4 border border-[#D4D4D4]">
            {reservedList.length > 0 ? (
              <List
                dataSource={reservedList}
                renderItem={(item, index) => (
                  <List.Item
                    className="border-b last:border-b-0 border-[#D4D4D4]"
                    actions={[
                      <Button
                        key="remove"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong className="text-[#2B2B2B]">{index + 1}.</Text>
                          <Text className="text-[#2B2B2B]">{item}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4 text-gray-400">
                No reserved items added yet.
              </div>
            )}
          </div>

          {submitError && <Alert message={submitError} type="error" showIcon className="mt-4" />}

          <div className="flex justify-end mt-8">
            <Button
              type="primary"
              loading={isLoading}
              onClick={handleSubmit}
              size="large"
              className="bg-[#004E60] hover:bg-[#003a48] border-none px-8"
            >
              Update Reserved Property
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}