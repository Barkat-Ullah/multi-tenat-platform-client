"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { appAlert } from "@/utils/appAlert";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useUploadComplianceDocumentsMutation } from "@/redux/service/agent/propertiesApi";
import { Button, Card, Typography, Space, Alert, Upload, message } from "antd";
import { InboxOutlined, DeleteOutlined, FileOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { toast } from "sonner";

const { Title, Text } = Typography;
const { Dragger } = Upload;

type DocKey =
  | "energyCertificate"
  | "urbanCadastral"
  | "ownershipDeed"
  | "leaseAgreement";

type DocState = Record<DocKey, File | null>;

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

function getErrorMessage(err: unknown, fallback = "Failed to submit compliance documents.") {
  if (typeof err === "object" && err !== null) {
    if ("data" in err) {
      const fetchError = err as FetchBaseQueryError & { data?: { message?: string } };
      return fetchError.data?.message || fallback;
    }
    if ("message" in err) {
      const serializedError = err as SerializedError;
      return serializedError.message || fallback;
    }
  }
  return fallback;
}

export interface ComplianceHandle {
  submit: () => Promise<boolean>;
  isLoading: boolean;
}

const Compliance = forwardRef<ComplianceHandle>((props, ref) => {
  const [uploadCompliance, { isLoading }] = useUploadComplianceDocumentsMutation();

  const [propertyId, setPropertyId] = useState<string>("");
  const [files, setFiles] = useState<DocState>({
    energyCertificate: null,
    urbanCadastral: null,
    ownershipDeed: null,
    leaseAgreement: null,
  });

  const [errors, setErrors] = useState<Partial<Record<DocKey | "propertyId", string>>>({});

  useEffect(() => {
    const savedId =
      localStorage.getItem("createdPropertyId") ||
      localStorage.getItem("propertyId") ||
      "";

    if (savedId) setPropertyId(savedId);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Only jpg, png, webp, or pdf files are allowed.";
    if (file.size > MAX_FILE_SIZE) return "File size must be less than or equal to 25MB.";
    return null;
  };

  const setDocFile = (key: DocKey, file: File | null) => {
    if (!file) {
      setFiles((prev) => ({ ...prev, [key]: null }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    const validationMsg = validateFile(file);
    if (validationMsg) {
      setErrors((prev) => ({ ...prev, [key]: validationMsg }));
      message.error(validationMsg);
      return;
    }

    setErrors((prev) => ({ ...prev, [key]: "" }));
    setFiles((prev) => ({ ...prev, [key]: file }));
    message.success(`${file.name} uploaded successfully`);
  };

  const removeFile = (key: DocKey) => {
    setDocFile(key, null);
  };

  const handleUpload = (key: DocKey, file: File) => {
    setDocFile(key, file);
    return false;
    // Prevent auto upload
  };

  const validateForm = (): boolean => {
    const nextErrors: typeof errors = {};

    if (!propertyId.trim()) nextErrors.propertyId = "Property ID is required.";

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    const formData = new FormData();
    formData.append("propertyId", propertyId.trim());

    if (files.energyCertificate) formData.append("energyCertificate", files.energyCertificate);
    if (files.urbanCadastral) formData.append("urbanCadastral", files.urbanCadastral);
    if (files.ownershipDeed) formData.append("ownershipDeed", files.ownershipDeed);
    if (files.leaseAgreement) formData.append("leaseAgreement", files.leaseAgreement);

    // Debug exactly like your previous page
    for (const [k, v] of formData.entries()) {
      console.log(k, v instanceof File ? `FILE: ${v.name} (${v.type})` : v);
    }
    try {
      const res = await uploadCompliance(formData).unwrap();

      // Store form data for this step
      const stepData = {
        energyCertificate: files.energyCertificate?.name,
        urbanCadastral: files.urbanCadastral?.name,
        ownershipDeed: files.ownershipDeed?.name,
        leaseAgreement: files.leaseAgreement?.name,
      };
      localStorage.setItem("complianceInfo", JSON.stringify(stepData));

      await toast.success(res?.message || "Compliance documents uploaded successfully.")
      return true;
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      await toast.error(msg)
      return false;
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    isLoading
  }));

  const UploadBox = ({
    title,
    keyName,
    description,
  }: {
    title: string;
    keyName: DocKey;
    description?: string;
  }) => {
    const file = files[keyName];

    return (
      <Card size="small" title={title} style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Dragger
            beforeUpload={(file) => handleUpload(keyName, file)}
            showUploadList={false}
            multiple={false}
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            style={{ background: '#F8F8F6' }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Drop file or browse</p>
            <p className="ant-upload-hint">
              Format: .jpeg, .png, .webp, .pdf • Max size: 25 MB
            </p>
          </Dragger>

          {file && (
            <Card size="small" style={{ background: '#f5f5f5' }}>
              <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <FileOutlined />
                  <div>
                    <Text strong>{file.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {Math.round(file.size / 1024)} KB
                    </Text>
                  </div>
                </Space>
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => removeFile(keyName)}
                >
                  Remove
                </Button>
              </Space>
            </Card>
          )}

          {!!errors[keyName] && (
            <Alert message={errors[keyName]} type="error" showIcon />
          )}
        </Space>
      </Card>
    );
  };

  return (
    <div className="font-inter" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#223355', marginBottom: 8 }}>
            Compliance & Documentation
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Provide regulatory compliance records and supporting documents. This
            information ensures regulatory adherence and protects against potential
            legal risks.
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

        {/* Upload Sections */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <UploadBox title="Energy Certificate (APE)" keyName="energyCertificate" />
          <UploadBox title="Urban/Cadastral Compliance" keyName="urbanCadastral" />
          <UploadBox title="Ownership Deed" keyName="ownershipDeed" />
          <UploadBox title="Lease Agreement" keyName="leaseAgreement" />
        </Space>

        {/* Error Display */}
        {errors.propertyId && (
          <Alert
            message={errors.propertyId}
            type="error"
            showIcon
            style={{ marginTop: 24 }}
          />
        )}

        {/* Note: Submit button removed as it will be triggered from parent */}
      </Card>
    </div>
  );
});

Compliance.displayName = 'Compliance';

export default Compliance;