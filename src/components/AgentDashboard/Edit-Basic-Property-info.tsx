/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useUpdatePropertyMutation } from "@/redux/service/agent/propertiesApi";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { appAlert } from "@/utils/appAlert";
import { Modal } from "antd";
import Map from "./Map";
import { getImageUrl } from "@/utils/getImageUrl";

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string; // object URL for images
};

// Small helper: numeric inputs -> number (backend expects number)
const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function EditBasicPropertyInfo({ propertyData }: any) {
  const [updateProperty, { isLoading }] = useUpdatePropertyMutation();

  // ✅ Controlled form states (match backend schema exactly)
  const [propertyId, setPropertyId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState(""); // backend expects "type"
  const [listedFor, setListedFor] = useState(""); // backend expects "listedFor"

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [commercialArea, setCommercialArea] = useState("");
  const [useableArea, setUseableArea] = useState("");

  const [balconyArea, setBalconyArea] = useState("");
  const [terraceArea, setTerraceArea] = useState("");
  const [gardenArea, setGardenArea] = useState("");
  const [patioArea, setPatioArea] = useState("");
  const [roofTerrace, setRoofTerrace] = useState("");
  const [garageArea, setGarageArea] = useState("");

  const [description, setDescription] = useState("");

  const [finishesLevel, setFinishesLevel] = useState(""); // enum string
  const [condition, setCondition] = useState(""); // enum string
  const [builtYear, setBuiltYear] = useState("");

  //  New states for images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);

  //  Upload states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // capture lat lng from map data
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);


  //  PERFECT: Populate with existing data (EDIT MODE)
  useEffect(() => {
    if (propertyData?.data) {
      console.log(" Property data received for population:", propertyData.data);

      const data = propertyData.data;

      // Set ID
      setPropertyId(data.id || "");

      // Basic fields
      setTitle(data.title || "");
      setType(data.type || "");
      setListedFor(data.listedFor || "");
      setAddress(data.address || "");
      setCity(data.city || "");

      // Coordinates
      if (data.lat != null && data.long != null) {
        const latNum = typeof data.lat === 'string' ? parseFloat(data.lat) : data.lat;
        const lngNum = typeof data.long === 'string' ? parseFloat(data.long) : data.long;

        if (!isNaN(latNum) && !isNaN(lngNum)) {
          setLatLng({ lat: latNum, lng: lngNum });
        }
      }

      // Area fields
      setCommercialArea(data.commercialArea?.toString() || "0");
      setUseableArea(data.useableArea?.toString() || "0");
      setBalconyArea(data.balconyArea?.toString() || "0");
      setTerraceArea(data.terraceArea?.toString() || "0");
      setGardenArea(data.gardenArea?.toString() || "0");
      setPatioArea(data.patioArea?.toString() || "0");
      setRoofTerrace(data.roofTerrace?.toString() || "0");
      setGarageArea(data.garageArea?.toString() || "0");

      // Enums
      setFinishesLevel(data.finishesLevel || "");
      setCondition(data.condition || "");

      // Built year
      if (data.builtYear) {
        const date = new Date(data.builtYear);
        if (!isNaN(date.getTime())) {
          setBuiltYear(date.toISOString().split("T")[0]);
        }
      }

      setDescription(data.description || "");

      //  Load existing images
      if (data.images && Array.isArray(data.images)) {
        setExistingImages(data.images);
      }

      console.log(" All edit fields populated successfully!");
    }
  }, [propertyData?.data]); //  Use nested property as dependency

  //  Cleanup object URLs
  useEffect(() => {
    return () => {
      uploads.forEach((u) => {
        if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
  }, []);

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    setUploadError(null);

    const files = Array.from(fileList);

    // Validate
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setUploadError("Only jpg, png, webp, or pdf files are allowed.");
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setUploadError("File size must be less than or equal to 25MB.");
        return;
      }
    }

    // Map to UploadItem with previews (only images get preview; pdf uses placeholder)
    const newItems: UploadItem[] = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
          .toString(16)
          .slice(2)}`,
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : "",
      };
    });

    setUploads((prev) => [...prev, ...newItems]);
  }

  function onBrowseClick() {
    fileInputRef.current?.click();
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files);
    // Allow picking same file again
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function removeUpload(id: string) {
    setUploads((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setRemovedExistingImages((prev) => [...prev, url]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!propertyId) return setSubmitError("Property ID is missing.");
    if (!title.trim()) return setSubmitError("Title is required.");
    if (!type.trim()) return setSubmitError("Type is required.");
    if (!listedFor.trim()) return setSubmitError("Listed For is required.");
    if (!address.trim()) return setSubmitError("Address is required.");
    if (!finishesLevel.trim())
      return setSubmitError("Finishes Level is required.");
    if (!condition.trim()) return setSubmitError("Condition is required.");
    if (!builtYear.trim()) return setSubmitError("Built Year is required.");

    // builtYear: "YYYY-MM-DD" -> ISO
    const dateObj = new Date(builtYear);
    if (Number.isNaN(dateObj.getTime())) {
      return setSubmitError("Invalid Built Year date.");
    }
    const builtYearISO = dateObj.toISOString();

    //  Build payload EXACTLY like backend expects
    const payload = {
      title: title.trim(),
      type: type.trim(),
      listedFor: listedFor.trim(),
      description: description.trim(),
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
      // Pass the list of images to be removed if backend supports it
    };

    const formData = new FormData();

    // Add new images
    uploads.forEach((u) => {
      formData.append("images", u.file);
    });

    formData.append("data", JSON.stringify(payload));

    try {
      const res = await updateProperty({ id: propertyId, formData }).unwrap();
      if (res?.success) {
        appAlert.fire({
          title: "Success!",
          text: res.message || "Property updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        appAlert.fire({
          title: "Error!",
          text: res.message || "Failed to update property.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error: any) {
      appAlert.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to submit form.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log(error);
      setSubmitError("Failed to submit form.");
    }
  };

  return (
    <div className="font-inter">
      <div className="text-center mb-7  ">
        <h2 className="text-2xl md:text-3xl font-lato font-semibold text-[#223355] text-center mb-2">
          Edit Basic Property Info
        </h2>
        <p className="text-[#003944] text-sm md:text-[18px] font-medium mb-8">
          Update the foundational property information.
        </p>
      </div>

      {propertyId && (
        <p className="text-sm text-gray-600 mb-6 text-center bg-gray-50 py-2 rounded">
          Editing Property ID: <span className="font-bold">{propertyId}</span>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Property Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full px-4 py-4  text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500  flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Property Type (backend: type)
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              >
                <option value="">Select type</option>
                <option value="FLAT">FLAT</option>
                <option value="LAND">LAND</option>
                <option value="HOSPITALITY">HOSPITALITY</option>
                <option value="OFFICES">OFFICES</option>
                <option value="SHOPS">SHOPS</option>
                <option value="OTHERS">OTHERS</option>
              </select>
            </div>
          </div>

          {/* Listed For */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Listed For (backend: listedFor)
              </label>
              <select
                value={listedFor}
                onChange={(e) => setListedFor(e.target.value)}
                className="w-full px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              >
                <option value="">Select</option>
                <option value="RENT">RENT</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
          </div>

          {/* Map Pin & Location */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Map Pin
              </label>
              <button
                onClick={showModal}
                type="button"
                className=" p-4 bg-[#004E60] text-white rounded-lg text-sm md:text-[18px] font-medium  transition-colors"
              >
                Select Location
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                  Location Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter location"
                  className="w-full px-4 py-4  text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500  flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                />
              </div>

              <div>
                <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                  City (optional)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-4  text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500  flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latitude */}
              <div>
                <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                  Latitude (from map)
                </label>
                <input
                  type="text"
                  value={latLng?.lat?.toFixed(6) || ""} // Format nicely
                  readOnly // ✅ Critical: Prevents broken edits
                  className="w-full px-4 py-4 bg-gray-100 text-gray-700 rounded-[8px] border border-[#D4D4D4]"
                  placeholder="Select location on map"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                  Longitude (from map)
                </label>
                <input
                  type="text"
                  value={latLng?.lng?.toFixed(6) || ""}
                  readOnly // ✅ Critical
                  className="w-full px-4 py-4 bg-gray-100 text-gray-700 rounded-[8px] border border-[#D4D4D4]"
                  placeholder="Select location on map"
                />
              </div>
            </div>
          </div>

          {/* Property Size & Spaces */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Property Size & Spaces
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                  Total Commercial Area (sqm)
                </label>
                <input
                  type="number"
                  value={commercialArea}
                  onChange={(e) => setCommercialArea(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                />
              </div>
              <div>
                <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                  Net Usable Area (sqm)
                </label>
                <input
                  type="number"
                  value={useableArea}
                  onChange={(e) => setUseableArea(e.target.value)}
                  placeholder="120"
                  className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                />
              </div>
            </div>
          </div>

          {/* Extra areas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Areas (sqm)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                    Balcony Area
                  </label>
                  <input
                    type="number"
                    value={balconyArea}
                    onChange={(e) => setBalconyArea(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                    Terrace Area
                  </label>
                  <input
                    type="number"
                    value={terraceArea}
                    onChange={(e) => setTerraceArea(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                    Garden Area
                  </label>
                  <input
                    type="number"
                    value={gardenArea}
                    onChange={(e) => setGardenArea(e.target.value)}
                    placeholder="40"
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                    Patio Area
                  </label>
                  <input
                    type="number"
                    value={patioArea}
                    onChange={(e) => setPatioArea(e.target.value)}
                    placeholder="90"
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                    Roof Terrace
                  </label>
                  <input
                    type="number"
                    value={roofTerrace}
                    onChange={(e) => setRoofTerrace(e.target.value)}
                    placeholder="120"
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                    Garage Area
                  </label>
                  <input
                    type="number"
                    value={garageArea}
                    onChange={(e) => setGarageArea(e.target.value)}
                    placeholder="60"
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BuiltYear + Finishes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Built Year (date)
              </label>
              <input
                type="date"
                value={builtYear}
                onChange={(e) => setBuiltYear(e.target.value)}
                className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Finishes Level
              </label>
              <select
                value={finishesLevel}
                onChange={(e) => setFinishesLevel(e.target.value)}
                className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              >
                <option value="">Select</option>
                <option value="STANDARD">STANDARD</option>
                <option value="MID_HIGH">MID_HIGH</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="LUXURY">LUXURY</option>
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
              Property Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-[5px] self-stretch rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
            >
              <option value="">Select</option>
              <option value="NEWLY_BUILT">NEWLY_BUILT</option>
              <option value="RECENTLY_RENOVATED">RECENTLY_RENOVATED</option>
              <option value="GOOD_CONDITION">GOOD_CONDITION</option>
              <option value="DATED_FINISHES">DATED_FINISHES</option>
              <option value="NEEDS_RENOVATION">NEEDS_RENOVATION</option>
              <option value="LUXURY_STANDARD">LUXURY_STANDARD</option>
              <option value="HISTORICAL_PERIOD">HISTORICAL_PERIOD</option>
            </select>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
              Property Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe key features..."
              className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004E60] rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6] min-h-[150px] resize-y"
              rows={5}
            />
          </div>

          {/* Photos / Floor Plan Upload */}
          <div>
            <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
              Photos / Floor Plan
            </label>

            {/* Existing Images Grid */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Existing Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {existingImages.map((url, idx) => (
                    <div key={idx} className="aspect-square bg-white border border-gray-200 rounded-lg relative overflow-hidden group">
                      <Image
                        src={getImageUrl(url)}
                        alt={`Existing ${idx}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={onInputChange}
              className="hidden"
            />

            <div
              onClick={onBrowseClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`border-2 flex items-center flex-col border-dashed rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer ${isDragging ? "border-[#004E60]" : "border-gray-300"
                }`}
            >
              <p className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Drop new files or browse
              </p>
              <p className="block text-sm md:text-[18px] font-normal text-[#BDBDBD] mb-3">
                Format: jpg, pdf • Max size: 25 MB
              </p>

              <button
                type="button"
                className=" p-4 bg-[#004E60] text-white rounded-lg text-sm md:text-[18px] font-medium  transition-colors px-8"
              >
                Browse Files
              </button>

              {uploadError && (
                <p className="mt-3 text-sm text-red-600">{uploadError}</p>
              )}
            </div>

            {/* Thumbnails / Files */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
              {uploads?.map((u) => {
                const isPdf = u.file.type === "application/pdf";
                return (
                  <div
                    key={u.id}
                    className="aspect-square bg-gray-100 border border-gray-300 rounded-lg relative overflow-hidden flex items-center justify-center group"
                  >
                    <button
                      type="button"
                      onClick={() => removeUpload(u.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full opacity-100 flex items-center justify-center cursor-pointer"
                    >
                      <span className="text-white text-xs">×</span>
                    </button>

                    {isPdf ? (
                      <div className="text-center px-2">
                        <p className="text-xs font-semibold text-gray-700">PDF</p>
                        <p className="text-[10px] text-gray-500 break-words line-clamp-2">{u.file.name}</p>
                      </div>
                    ) : (
                      <Image
                        src={u.previewUrl}
                        width={100}
                        height={100}
                        alt={u.file.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="p-4 bg-[#004E60] text-white rounded-lg text-sm md:text-[18px] font-medium transition-colors px-12 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Basic Info"}
            </button>
          </div>
        </div>
      </form>

      {/* Modal for the Map */}
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
          <div className="mt-2 text-sm text-center font-medium">
            📍 Selected: Lat {latLng.lat.toFixed(6)}, Lng {latLng.lng.toFixed(6)}
          </div>
        )}
      </Modal>
    </div>
  );
}
