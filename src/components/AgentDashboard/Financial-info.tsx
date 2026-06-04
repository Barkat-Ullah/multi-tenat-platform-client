// "use client";

// import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import type { SerializedError } from "@reduxjs/toolkit";

// import { useCreateFinancialInfoMutation } from "@/redux/service/agent/propertiesApi";
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
// import { appAlert } from "@/utils/appAlert";
// import { Form, Input, Button, Card, Typography, Row, Col, Space, Alert } from "antd";
// import { toast } from "sonner";

// const { Title, Text } = Typography;

// // helper: convert input -> number safely
// const toNumber = (v: string) => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : 0;
// };

// export interface FinancialInfoHandle {
//   submit: () => Promise<boolean>;
//   isLoading: boolean;
// }

// const FinancialInfo = forwardRef<FinancialInfoHandle>((props, ref) => {
//   const [createFinancialInfo, { isLoading }] = useCreateFinancialInfoMutation();

//   const [propertyId, setPropertyId] = useState("");

//   // controlled fields (all are numbers in backend)
//   const [askingPrice, setAskingPrice] = useState("");
//   const [managementFee, setManagementFee] = useState("");
//   const [propertyTax, setPropertyTax] = useState("");
//   const [grossAnnualRent, setGrossAnnualRent] = useState("");
//   const [netAnnualIncome, setNetAnnualIncome] = useState("");
//   const [perSqmCommercial, setPerSqmCommercial] = useState("");
//   const [perSqmRentYield, setPerSqmRentYield] = useState("");
//   const [grossYield, setGrossYield] = useState("");
//   const [netYield, setNetYield] = useState("");

//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const [form] = Form.useForm();

//   //  read propertyId saved from BasicPropertyInfo step
//   useEffect(() => {
//     const id = localStorage.getItem("createdPropertyId");
//     if (id) setPropertyId(id);
//   }, []);

//   const validateForm = (): boolean => {
//     if (!propertyId) {
//       setSubmitError("Property ID not found. Please create property first.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (): Promise<boolean> => {
//     setSubmitError(null);

//     if (!validateForm()) {
//       return false;
//     }

//     //  Build payload exactly like Postman expects
//     const payload = {
//       propertyId,
//       askingPrice: toNumber(askingPrice),
//       managementFee: toNumber(managementFee),
//       propertyTax: toNumber(propertyTax),
//       grossAnnualRent: toNumber(grossAnnualRent),
//       netAnnualIncome: toNumber(netAnnualIncome),
//       perSqmCommercial: toNumber(perSqmCommercial),
//       perSqmRentYield: toNumber(perSqmRentYield),
//       grossYield: toNumber(grossYield),
//       netYield: toNumber(netYield),
//     };

//     //  debug
//     console.log("=== Financial payload ===", payload);

//     try {
//       const res = await createFinancialInfo(payload).unwrap();

//       if (res?.success) {
//         // Store form data for this step
//         const stepData = {
//           askingPrice,
//           managementFee,
//           propertyTax,
//           grossAnnualRent,
//           netAnnualIncome,
//           perSqmCommercial,
//           perSqmRentYield,
//           grossYield,
//           netYield,
//         };
//         localStorage.setItem("financialInfo", JSON.stringify(stepData));

//         await toast.success(res.message || "Financial info submitted successfully.")
//         return true;
//       } else {
//         setSubmitError(res?.message || "Failed to submit financial info.");
//         return false;
//       }
//     } catch (err: unknown) {
//       console.log("Financial submit error:", err);

//       let errorMessage = "Failed to submit financial info.";

//       if (typeof err === "object" && err !== null) {
//         if ("data" in err) {
//           const fetchError = err as FetchBaseQueryError & {
//             data?: { message?: string };
//           };
//           errorMessage = fetchError.data?.message || errorMessage;
//         } else if ("message" in err) {
//           const serializedError = err as SerializedError;
//           errorMessage = serializedError.message || errorMessage;
//         }
//       }

//       await toast.error(errorMessage)

//       setSubmitError(errorMessage);
//       return false;
//     }
//   };

//   // Expose methods to parent component
//   useImperativeHandle(ref, () => ({
//     submit: handleSubmit,
//     isLoading
//   }));

//   return (
//     <div className="font-inter" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
//       <Card>
//         {/* Header */}
//         <div style={{ textAlign: 'center', marginBottom: 32 }}>
//           <Title level={2} style={{ color: '#223355', marginBottom: 8 }}>
//             Financial Info
//           </Title>
//           <Text type="secondary" style={{ fontSize: 16 }}>
//             Provide the property’s financial details and records.
//           </Text>
//         </div>

//         {/* Property ID Display */}
//         {propertyId && (
//           <Alert
//             message={
//               <Text>
//                 Property ID: <Text strong>{propertyId}</Text>
//               </Text>
//             }
//             type="info"
//             showIcon
//             style={{ marginBottom: 24 }}
//           />
//         )}

//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSubmit}
//           requiredMark={false}
//         >
//           <Row gutter={[24, 24]}>
//             {/* Left Column */}
//             <Col xs={24} md={12}>
//               <Space direction="vertical" size="large" style={{ width: '100%' }}>
//                 {/* Asking Price */}
//                 <Form.Item label={<Text strong>Asking Price (€)</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={askingPrice}
//                     onChange={(e) => setAskingPrice(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* Property Taxes */}
//                 <Form.Item label={<Text strong>Property Taxes (IMU, TASI, etc.)</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={propertyTax}
//                     onChange={(e) => setPropertyTax(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* Net Annual Income */}
//                 <Form.Item label={<Text strong>Net Annual Income</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={netAnnualIncome}
//                     onChange={(e) => setNetAnnualIncome(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* €/sqm Rent Yield */}
//                 <Form.Item label={<Text strong>€/sqm Rent Yield</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={perSqmRentYield}
//                     onChange={(e) => setPerSqmRentYield(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* Net Yield % */}
//                 <Form.Item label={<Text strong>Net Yield %</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={netYield}
//                     onChange={(e) => setNetYield(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>
//               </Space>
//             </Col>

//             {/* Right Column */}
//             <Col xs={24} md={12}>
//               <Space direction="vertical" size="large" style={{ width: '100%' }}>
//                 {/* Management Fees */}
//                 <Form.Item label={<Text strong>Management Fees (€ per month)</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={managementFee}
//                     onChange={(e) => setManagementFee(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* Gross Annual Rent */}
//                 <Form.Item label={<Text strong>Gross Annual Rent</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={grossAnnualRent}
//                     onChange={(e) => setGrossAnnualRent(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* €/sqm Commercial */}
//                 <Form.Item label={<Text strong>€/sqm Commercial</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={perSqmCommercial}
//                     onChange={(e) => setPerSqmCommercial(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* Gross Yield % */}
//                 <Form.Item label={<Text strong>Gross Yield %</Text>}>
//                   <Input
//                     size="large"
//                     type="number"
//                     value={grossYield}
//                     onChange={(e) => setGrossYield(e.target.value)}
//                     placeholder="Enter amount"
//                   />
//                 </Form.Item>

//                 {/* Error Display */}
//                 {submitError && (
//                   <Form.Item>
//                     <Alert message={submitError} type="error" showIcon />
//                   </Form.Item>
//                 )}

//                 {/* Note: Submit button removed as it will be triggered from parent */}
//                 <div style={{ height: 16 }} />
//               </Space>
//             </Col>
//           </Row>
//         </Form>
//       </Card>
//     </div>
//   );
// });

// FinancialInfo.displayName = 'FinancialInfo';

// export default FinancialInfo;

"use client";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import { useCreateFinancialInfoMutation } from "@/redux/service/agent/propertiesApi";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Form, Input, Card, Typography, Row, Col, Space, Alert } from "antd";
import { toast } from "sonner";

const { Title, Text } = Typography;

const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const formatNumber = (value: number, decimals = 2) => {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(decimals);
};

export interface FinancialInfoHandle {
  submit: () => Promise<boolean>;
  isLoading: boolean;
}

const FinancialInfo = forwardRef<FinancialInfoHandle>((props, ref) => {
  const [createFinancialInfo, { isLoading }] = useCreateFinancialInfoMutation();

  const [propertyId, setPropertyId] = useState("");
  const [commercialAreaFromStorage, setCommercialAreaFromStorage] = useState(0);

  // form fields
  const [askingPrice, setAskingPrice] = useState("");
  const [managementFee, setManagementFee] = useState(""); // monthly
  const [imuTax, setImuTax] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [grossAnnualRent, setGrossAnnualRent] = useState("");
  const [netAnnualIncome, setNetAnnualIncome] = useState("");
  const [perSqmCommercial, setPerSqmCommercial] = useState("");
  const [perSqmRentYield, setPerSqmRentYield] = useState("");
  const [grossYield, setGrossYield] = useState("");
  const [netYield, setNetYield] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const id = localStorage.getItem("createdPropertyId");
    if (id) setPropertyId(id);

    const basicInfo = localStorage.getItem("basicPropertyInfo");
    if (basicInfo) {
      const parsed = JSON.parse(basicInfo);

      if (parsed?.commercialArea) {
        setCommercialAreaFromStorage(Number(parsed.commercialArea) || 0);
      }
    }

    const savedFinancialInfo = localStorage.getItem("financialInfo");
    if (savedFinancialInfo) {
      const parsed = JSON.parse(savedFinancialInfo);

      setAskingPrice(parsed.askingPrice || "");
      setManagementFee(parsed.managementFee || "");
      setImuTax(parsed.imuTax || "");
      setMonthlyRent(parsed.monthlyRent || "");
      setGrossAnnualRent(parsed.grossAnnualRent || "");
      setNetAnnualIncome(parsed.netAnnualIncome || "");
      setPerSqmCommercial(parsed.perSqmCommercial || "");
      setPerSqmRentYield(parsed.perSqmRentYield || "");
      setGrossYield(parsed.grossYield || "");
      setNetYield(parsed.netYield || "");
    }
  }, []);

  useEffect(() => {
    const askingPriceNum = toNumber(askingPrice);
    const managementFeeNum = toNumber(managementFee);
    const imuTaxNum = toNumber(imuTax);
    const monthlyRentNum = toNumber(monthlyRent);
    const areaNum = commercialAreaFromStorage;

    const calculatedGrossAnnualRent = monthlyRentNum * 12;
    const calculatedGrossYield =
      askingPriceNum > 0 ? (calculatedGrossAnnualRent / askingPriceNum) * 100 : 0;
    const calculatedPerSqmCommercial =
      areaNum > 0 ? askingPriceNum / areaNum : 0;
    const calculatedPerSqmRentYield =
      areaNum > 0 ? calculatedGrossAnnualRent / areaNum : 0;
    const calculatedNetAnnualIncome =
      calculatedGrossAnnualRent - (managementFeeNum * 12 + imuTaxNum);
    const calculatedNetYield =
      askingPriceNum > 0 ? (calculatedNetAnnualIncome / askingPriceNum) * 100 : 0;

    setGrossAnnualRent(
      monthlyRent ? formatNumber(calculatedGrossAnnualRent, 2) : ""
    );
    setGrossYield(
      askingPrice || monthlyRent ? formatNumber(calculatedGrossYield, 2) : ""
    );
    setPerSqmCommercial(
      askingPrice && areaNum > 0 ? formatNumber(calculatedPerSqmCommercial, 2) : ""
    );
    setPerSqmRentYield(
      monthlyRent && areaNum > 0 ? formatNumber(calculatedPerSqmRentYield, 2) : ""
    );
    setNetAnnualIncome(
      monthlyRent || managementFee || imuTax
        ? formatNumber(calculatedNetAnnualIncome, 2)
        : ""
    );
    setNetYield(
      askingPrice || monthlyRent || managementFee || imuTax
        ? formatNumber(calculatedNetYield, 2)
        : ""
    );
  }, [askingPrice, managementFee, imuTax, monthlyRent, commercialAreaFromStorage]);

  const validateForm = (): boolean => {
    if (!propertyId) {
      setSubmitError("Property ID not found. Please create property first.");
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
      askingPrice: toNumber(askingPrice),
      managementFee: toNumber(managementFee),
      propertyTax: toNumber(imuTax),
      grossAnnualRent: toNumber(grossAnnualRent),
      netAnnualIncome: toNumber(netAnnualIncome),
      perSqmCommercial: toNumber(perSqmCommercial),
      perSqmRentYield: toNumber(perSqmRentYield),
      grossYield: toNumber(grossYield),
      netYield: toNumber(netYield),
    };
    console.log("=== Financial payload ===", payload);

    try {
      const res = await createFinancialInfo(payload).unwrap();

      if (res?.success) {
        const stepData = {
          askingPrice,
          managementFee,
          imuTax,
          monthlyRent,
          grossAnnualRent,
          netAnnualIncome,
          perSqmCommercial,
          perSqmRentYield,
          grossYield,
          netYield,
        };

        localStorage.setItem("financialInfo", JSON.stringify(stepData));
        toast.success(res.message || "Financial info submitted successfully.");
        return true;
      } else {
        setSubmitError(res?.message || "Failed to submit financial info.");
        return false;
      }
    } catch (err: unknown) {
      console.log("Financial submit error:", err);

      let errorMessage = "Failed to submit financial info.";

      if (typeof err === "object" && err !== null) {
        if ("data" in err) {
          const fetchError = err as FetchBaseQueryError & {
            data?: { message?: string };
          };
          errorMessage = fetchError.data?.message || errorMessage;
        } else if ("message" in err) {
          const serializedError = err as SerializedError;
          errorMessage = serializedError.message || errorMessage;
        }
      }

      toast.error(errorMessage);
      setSubmitError(errorMessage);
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    isLoading,
  }));

  return (
    <div
      className="font-inter"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}
    >
      <Card>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} style={{ color: "#223355", marginBottom: 8 }}>
            Financial Info
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Provide the property’s financial details and records.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Form.Item label={<Text strong>Asking Price (€)</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="Enter amount"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>IMU Tax (Annual)</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={imuTax}
                    onChange={(e) => setImuTax(e.target.value)}
                    placeholder="Enter annual IMU tax"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>Monthly Rent (€)</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="Enter monthly rent"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>Net Annual Income</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={netAnnualIncome}
                    readOnly
                    placeholder="Auto calculated"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>€/sqm Rent Yield</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={perSqmRentYield}
                    readOnly
                    placeholder="Auto calculated"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>Net Yield %</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={netYield}
                    readOnly
                    placeholder="Auto calculated"
                  />
                </Form.Item>
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Form.Item label={<Text strong>Management Fees (€ per month)</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={managementFee}
                    onChange={(e) => setManagementFee(e.target.value)}
                    placeholder="Enter amount"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>Gross Annual Rent</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={grossAnnualRent}
                    readOnly
                    placeholder="Auto calculated from monthly rent"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>€/sqm Commercial</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={perSqmCommercial}
                    readOnly
                    placeholder="Auto calculated"
                  />
                </Form.Item>

                <Form.Item label={<Text strong>Gross Yield %</Text>}>
                  <Input
                    size="large"
                    type="number"
                    value={grossYield}
                    readOnly
                    placeholder="Auto calculated"
                  />
                </Form.Item>

                {submitError && (
                  <Form.Item>
                    <Alert message={submitError} type="error" showIcon />
                  </Form.Item>
                )}

                <div style={{ height: 16 }} />
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
});

FinancialInfo.displayName = "FinancialInfo";

export default FinancialInfo;