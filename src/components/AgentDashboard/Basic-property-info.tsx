/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCreatePropertyMutation } from "@/redux/service/agent/propertiesApi";
import Image from "next/image";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { appAlert } from "@/utils/appAlert";
import { Button, Modal, Input, Select, Upload, Form, Row, Col, Space, Typography, Card, Divider, message, Alert } from "antd";
import { InboxOutlined, DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import Map from "./Map";
// import { PROPERTY_TYPES } from "../pages/All-Property/FilterSideBar";
import { LocateFixedIcon } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/store";

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
};

const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export interface BasicPropertyInfoHandle {
  submit: () => Promise<boolean>;
  isLoading: boolean;
}

const BasicPropertyInfo = forwardRef<BasicPropertyInfoHandle>((props, ref) => {

  const role = useAppSelector((state) => state?.auth.user?.role)

  const [initialData, setInitialData] = useState<{
    propertyType: string;
    listingType: string;
  } | null>(null);
  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [listedFor, setListedFor] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [commercialArea, setCommercialArea] = useState("");
  const [useableArea, setUseableArea] = useState("");
  const [balconyArea, setBalconyArea] = useState("");
  const [terraceArea, setTerraceArea] = useState("");
  const [gardenArea, setGardenArea] = useState("");
  const [patioArea, setPatioArea] = useState("");
  const [roofTerrace, setRoofTerrace] = useState("");
  const [garageArea, setGarageArea] = useState("");
  const [description, setDescription] = useState("");
  const [floorPlanDescription, setFloorPlanDescription] = useState("");
  const [finishesLevel, setFinishesLevel] = useState("");
  const [condition, setCondition] = useState("");
  const [builtYear, setBuiltYear] = useState("");

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [floorPlanUploads, setFloorPlanUploads] = useState<UploadItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [floorPlanUploadError, setFloorPlanUploadError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const getLatLngFromAddress = async (fullAddress: string) => {
    if (!fullAddress.trim()) return;

    try {
      setIsGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        setLatLng({
          lat: Number(firstResult.lat),
          lng: Number(firstResult.lon),
        });
      } else {
        setLatLng(null);
        toast.error("Could not find latitude and longitude from this address.")

      }
    } catch (error) {
      toast.error("Geocoding error");

    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    const fullAddress = `${address} ${city}`.trim();
    if (!address.trim()) {
      setLatLng(null);
      return;
    }

    const timer = setTimeout(() => {
      getLatLngFromAddress(fullAddress);
    }, 800);

    return () => clearTimeout(timer);
  }, [address, city]);

  useEffect(() => {
    const savedData = localStorage.getItem("addPropertyData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setInitialData(parsed);
      if (parsed?.propertyType) setType(parsed.propertyType);
      if (parsed?.listingType) setListedFor(parsed.listingType);
    }
  }, []);

  useEffect(() => {
    return () => {
      uploads.forEach((u) => {
        if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
      floorPlanUploads.forEach((u) => {
        if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
  }, [uploads, floorPlanUploads]);

  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

  const handleFileUpload = (file: File, type: 'main' | 'floor') => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error(`${file.name} is not allowed. Only jpg, png, webp, or pdf files are allowed.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error(`${file.name} exceeds 25MB limit.`);
      return false;
    }

    const newItem: UploadItem = {
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    };

    if (type === 'main') {
      setUploads(prev => [...prev, newItem]);
    } else {
      setFloorPlanUploads(prev => [...prev, newItem]);
    }
    return false;
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setSubmitError("Title is required.");
      return false;
    }
    if (!type.trim()) {
      setSubmitError("Type is required.");
      return false;
    }
    if (!listedFor.trim()) {
      setSubmitError("Listed For is required.");
      return false;
    }
    if (!address.trim()) {
      setSubmitError("Address is required.");
      return false;
    }
    if (!finishesLevel.trim()) {
      setSubmitError("Finishes Level is required.");
      return false;
    }
    if (!condition.trim()) {
      setSubmitError("Condition is required.");
      return false;
    }
    if (!builtYear.trim()) {
      setSubmitError("Built Year is required.");
      return false;
    }

    const dateObj = new Date(builtYear);
    if (Number.isNaN(dateObj.getTime())) {
      setSubmitError("Invalid Built Year date.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (): Promise<boolean> => {
    setSubmitError(null);

    if (!validateForm()) {
      return false;
    }

    const dateObj = new Date(builtYear);
    const builtYearISO = dateObj.toISOString();

    const payload = {
      title: title.trim(),
      type: type.trim(),
      listedFor: listedFor.trim(),
      description: description.trim(),
      floorPlanDesc: floorPlanDescription.trim(),
      lat: latLng?.lat.toString() || undefined,
      long: latLng?.lng.toString() || undefined,
      address: address.trim(),
      city: city.trim() || undefined,
      commercialArea: toNumber(commercialArea),
      useableArea: toNumber(useableArea),
      balconyArea: toNumber(balconyArea),
      terraceArea: toNumber(terraceArea),
      gardenArea: toNumber(gardenArea),
      patioArea: toNumber(patioArea),
      roofTerrace: toNumber(roofTerrace),
      garageArea: toNumber(garageArea),
      finishesLevel: finishesLevel.trim(),
      condition: condition.trim(),
      builtYear: builtYearISO,
    };

    const formData = new FormData();
    uploads.forEach((u) => formData.append("images", u.file));
    floorPlanUploads.forEach((u) => formData.append("floorPlanImg", u.file));
    formData.append("data", JSON.stringify(payload));

    try {
      const res = await createProperty(formData).unwrap();

      // Store the property ID in localStorage for subsequent steps
      const createdPropertyId = typeof res === 'string' ? res : res?.data?.id;
      if (createdPropertyId) {
        localStorage.setItem("createdPropertyId", createdPropertyId);

        // Store form data for this step
        const stepData = {
          title,
          type,
          listedFor,
          address,
          city,
          latLng,
          commercialArea,
          useableArea,
          balconyArea,
          terraceArea,
          gardenArea,
          patioArea,
          roofTerrace,
          garageArea,
          description,
          floorPlanDescription,
          finishesLevel,
          condition,
          builtYear,
        };
        localStorage.setItem("basicPropertyInfo", JSON.stringify(stepData));
      }

      if (res?.success) {
        await toast.success(res.message || "Basic property information saved successfully.")
        return true;
      } else {
        setSubmitError(res.message || "Failed to save property information.");
        return false;
      }
    } catch (error) {
      console.log(error);
      setSubmitError("Failed to submit form.");
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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#223355', marginBottom: 8 }}>
            Basic Property Info
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Submit foundational property information to ensure accurate listing and documentation.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={[24, 24]}>
            {/* Row 1 */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Property Title</Text>}
                required
              >
                <Input
                  size="large"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </Form.Item>
            </Col>

            {/* <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Property Type</Text>}
                required
              >
                <Select
                  size="large"
                  value={type || undefined}
                  onChange={setType}
                  placeholder="Select Property Type"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}

            {/* Listed For */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Listed For</Text>}
                required
              >
                <Select
                  size="large"
                  value={listedFor || undefined}
                  onChange={setListedFor}
                  placeholder="Select"
                >
                  {
                    role === "ADMIN" && <Option value="RENT">RENT</Option>

                  }
                  <Option value="SELL">SELL</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Map Pin */}
            <Col xs={24}>
              <Form.Item label={<Text strong>Map Pin</Text>}>
                <Button
                  type="primary"
                  size="large"
                  onClick={showModal}
                  style={{ backgroundColor: '#004E60' }}
                >
                  Select Location
                </Button>
              </Form.Item>
            </Col>

            {/* Address Fields */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Location Address</Text>}
                required
              >
                <Input
                  size="large"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter location"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<Text strong>City (optional)</Text>}>
                <Input
                  size="large"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<Text strong>Latitude (optional)</Text>}>
                <Input
                  size="large"
                  value={latLng?.lat || ''}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="41.9028"
                  disabled
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<Text strong>Longitude (optional)</Text>}>
                <Input
                  size="large"
                  value={latLng?.lng || ''}
                  onChange={(e) => setLong(e.target.value)}
                  placeholder="12.4964"
                  disabled
                />
              </Form.Item>
            </Col>

            {/* Property Size Section */}
            <Col xs={24}>
              <Divider orientation="left">Property Size & Spaces</Divider>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<Text strong>Total Commercial Area (sqm)</Text>}>
                <Input
                  size="large"
                  type="number"
                  value={commercialArea}
                  onChange={(e) => setCommercialArea(e.target.value)}
                  placeholder="100"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<Text strong>Net Usable Area (sqm)</Text>}>
                <Input
                  size="large"
                  type="number"
                  value={useableArea}
                  onChange={(e) => setUseableArea(e.target.value)}
                  placeholder="120"
                />
              </Form.Item>
            </Col>

            {/* Additional Areas */}
            <Col xs={24}>
              <Divider orientation="left">Additional Areas (sqm)</Divider>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Balcony Area">
                <Input
                  size="large"
                  type="number"
                  value={balconyArea}
                  onChange={(e) => setBalconyArea(e.target.value)}
                  placeholder="70"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Terrace Area">
                <Input
                  size="large"
                  type="number"
                  value={terraceArea}
                  onChange={(e) => setTerraceArea(e.target.value)}
                  placeholder="100"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Garden Area">
                <Input
                  size="large"
                  type="number"
                  value={gardenArea}
                  onChange={(e) => setGardenArea(e.target.value)}
                  placeholder="40"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Patio Area">
                <Input
                  size="large"
                  type="number"
                  value={patioArea}
                  onChange={(e) => setPatioArea(e.target.value)}
                  placeholder="90"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Roof Terrace">
                <Input
                  size="large"
                  type="number"
                  value={roofTerrace}
                  onChange={(e) => setRoofTerrace(e.target.value)}
                  placeholder="120"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Garage Area">
                <Input
                  size="large"
                  type="number"
                  value={garageArea}
                  onChange={(e) => setGarageArea(e.target.value)}
                  placeholder="60"
                />
              </Form.Item>
            </Col>

            {/* Built Year and Finishes */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Built Year</Text>}
                required
              >
                <Input
                  size="large"
                  type="date"
                  value={builtYear}
                  onChange={(e) => setBuiltYear(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Finishes Level</Text>}
                required
              >
                <Select
                  size="large"
                  value={finishesLevel || undefined}
                  onChange={setFinishesLevel}
                  placeholder="Select"
                >
                  <Option value="STANDARD">STANDARD</Option>
                  <Option value="MID_HIGH">MID HIGH</Option>
                  <Option value="PREMIUM">PREMIUM</Option>
                  <Option value="LUXURY">LUXURY</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Condition */}
            <Col xs={24}>
              <Form.Item
                label={<Text strong>Property Condition</Text>}
                required
              >
                <Select
                  size="large"
                  value={condition || undefined}
                  onChange={setCondition}
                  placeholder="Select"
                >
                  <Option value="NEWLY_BUILT">NEWLY BUILT</Option>
                  <Option value="RECENTLY_RENOVATED">RECENTLY RENOVATED</Option>
                  <Option value="GOOD_CONDITION">GOOD CONDITION</Option>
                  <Option value="DATED_FINISHES">DATED FINISHES</Option>
                  <Option value="NEEDS_RENOVATION">NEEDS RENOVATION</Option>
                  <Option value="LUXURY_STANDARD">LUXURY STANDARD</Option>
                  <Option value="HISTORICAL_PERIOD">HISTORICAL PERIOD</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Descriptions */}
            <Col xs={24}>
              <Form.Item label={<Text strong>Property Description</Text>}>
                <TextArea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Property Description"
                />
       
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={<Text strong>Floor Plan Description</Text>}>
                <TextArea
                  rows={5}
                  value={floorPlanDescription}
                  onChange={(e) => setFloorPlanDescription(e.target.value)}
                  placeholder="Floor Plan Description"
                />
            
              </Form.Item>
            </Col>

            {/* Main Property Photos */}
            <Col xs={24}>
              <Form.Item label={<Text strong>Property Photos Upload</Text>}>
                <Dragger
                  beforeUpload={(file) => handleFileUpload(file, 'main')}
                  multiple
                  showUploadList={false}
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  style={{ background: '#F8F8F6' }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Drop file or browse</p>
                  <p className="ant-upload-hint">Format: jpg, png, webp, pdf • Max size: 25 MB</p>
                </Dragger>

                {uploadError && (
                  <Alert message={uploadError} type="error" showIcon style={{ marginTop: 16 }} />
                )}

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  {uploads.map((u) => (
                    <Col key={u.id} xs={8} sm={6} md={4}>
                      <Card
                        size="small"
                        style={{ position: 'relative' }}
                        bodyStyle={{ padding: 8 }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setUploads(prev => prev.filter(p => p.id !== u.id))}
                          style={{ position: 'absolute', top: 4, right: 4, zIndex: 1 }}
                        />
                        {u.file.type === "application/pdf" ? (
                          <div style={{ textAlign: 'center', padding: 16 }}>
                            <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                            <div style={{ fontSize: 10, wordBreak: 'break-word' }}>{u.file.name}</div>
                          </div>
                        ) : (
                          <Image
                            src={u.previewUrl}
                            width={100}
                            height={100}
                            alt={u.file.name}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                          />
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            </Col>

            {/* Floor Plan Photos */}
            <Col xs={24}>
              <Form.Item label={<Text strong>Floor Plan Photos Upload </Text>}>
                <Dragger
                  beforeUpload={(file) => handleFileUpload(file, 'floor')}
                  maxCount={1}
                  showUploadList={false}
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  style={{ background: '#F8F8F6' }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Drop files or browse</p>
                  <p className="ant-upload-hint">Format: jpg, png, webp, pdf • Max size: 25 MB</p>
                </Dragger>

                {floorPlanUploadError && (
                  <Alert message={floorPlanUploadError} type="error" showIcon style={{ marginTop: 16 }} />
                )}

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  {floorPlanUploads.map((u) => (
                    <Col key={u.id} xs={8} sm={6} md={4}>
                      <Card
                        size="small"
                        style={{ position: 'relative' }}
                        bodyStyle={{ padding: 8 }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setFloorPlanUploads(prev => prev.filter(p => p.id !== u.id))}
                          style={{ position: 'absolute', top: 4, right: 4, zIndex: 1 }}
                        />
                        {u.file.type === "application/pdf" ? (
                          <div style={{ textAlign: 'center', padding: 16 }}>
                            <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                            <div style={{ fontSize: 10, wordBreak: 'break-word' }}>{u.file.name}</div>
                          </div>
                        ) : (
                          <Image
                            src={u.previewUrl}
                            width={100}
                            height={100}
                            alt={u.file.name}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                          />
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            </Col>

            {/* Error Display */}
            {submitError && (
              <Col xs={24}>
                <Alert message={submitError} type="error" showIcon />
              </Col>
            )}
          </Row>
        </Form>
      </Card>

      {/* Map Modal */}
      <Modal
        title="Select Location"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        destroyOnClose
      >
        {isModalOpen && <Map onSelect={setLatLng} />}
        {latLng && (
          <Space style={{ marginTop: 8 }}>
            <LocateFixedIcon />
            <Text>Lat: {latLng.lat}, Lng: {latLng.lng}</Text>
          </Space>
        )}
      </Modal>
    </div>
  );
});

BasicPropertyInfo.displayName = 'BasicPropertyInfo';

export default BasicPropertyInfo;