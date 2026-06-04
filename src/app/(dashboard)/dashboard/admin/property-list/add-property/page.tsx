/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PropertyType {
  id: string;
  name: string;
  image: string;
}

export default function AddPropertyHomePage() {
  const [selectedOption, setSelectedOption] = useState<
    Record<string, "rent" | "sell" | null>
  >({});

  const propertyTypes: PropertyType[] = [
    { id: "residential", name: "Residential", image: "/images/residential.png" },
    { id: "buildings", name: "Buildings", image: "/images/buildings.png" },
    { id: "flat", name: "Flat", image: "/images/flat.png" },
    { id: "shops", name: "Shops", image: "/images/shop.png" },
    { id: "garage", name: "Garage", image: "/images/garage.png" },
    { id: "offices", name: "Offices", image: "/images/offices.png" },
    { id: "land", name: "Land", image: "/images/land.png" },
    { id: "warehouses", name: "Warehouses", image: "/images/warehouses.png" },
  ];
  console.log(propertyTypes);

  const handleOptionChange = (cardId: string, option: "rent" | "sell") => {
    setSelectedOption((prev) => ({
      ...prev,
      [cardId]: prev[cardId] === option ? null : option,
    }));
  };

  const getSelectedOption = (id: string) => selectedOption[id] || null;

  // Find the first (or only) selected property + option
  const findSelection = () => {
    for (const type of propertyTypes) {
      if (selectedOption[type.id]) {
        return { propertyId: type.id, option: selectedOption[type.id] };
      }
    }
    return null;
  };

  const router = useRouter();
  const handleProceed = () => {
    const selection = findSelection();

    if (!selection || !selection.option) {
      alert("Please select Rent or sell for one property type.");
      return;
    }

    // Save to Local Storage
    const dataToSave = {
      propertyType: selection.propertyId.toUpperCase(), // e.g. "RESIDENTIAL"
      listingType: selection.option.toUpperCase(), // "rent" or "sell"
    };

    localStorage.setItem("addPropertyData", JSON.stringify(dataToSave));

    // Navigate
    router.push("/dashboard/admin/property-list/add-property/steps");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Add Property
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyTypes?.map((type) => (
            <div
              key={type.id}
              className="relative bg-white rounded-2xl border border-[#F1F5F9] p-6 
                hover:shadow-[0_6px_15px_-3px_rgba(136,126,251,0.8),_0_4px_6px_-4px_rgba(226,232,240,0.5)]
                transition-shadow duration-300 overflow-hidden"
            >
              {/* Card Content */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    width={100}
                    height={100}
                    unoptimized
                    src={type.image || "/images/no-image.png"}
                    alt={type.name}
                  />
                </div>
                {/* Title */}
                <h3 className="font-semibold text-gray-800 text-center">
                  {type.name}
                </h3>

                {/* Options */}
                <div className="flex flex-col space-y-2 w-full">
                  {/* Rent */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOptionChange(type.id, "rent")}
                      className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                        getSelectedOption(type.id) === "rent"
                          ? "bg-emerald-500 border-emerald-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {getSelectedOption(type.id) === "rent" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="none"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                    <span className="text-gray-700">Rent</span>
                  </div>

                  {/* sell */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOptionChange(type.id, "sell")}
                      className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                        getSelectedOption(type.id) === "sell"
                          ? "bg-red-500 border-red-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {getSelectedOption(type.id) === "sell" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="none"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                    <span className="text-gray-700">sell</span>
                  </div>
                </div>
              </div>

              {/* Bottom shadow */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/5 to-transparent"></div>

              {/* Top-right tick badge (optional – matches your image) */}
              {getSelectedOption(type.id) && (
                <div
                  className={`absolute top-2 right-2 w-5 h-5 rounded-sm flex items-center justify-center ${
                    getSelectedOption(type.id) === "rent"
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="none"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Proceed Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleProceed}
            className="bg-[#004E60] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <span>PROCEED</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 7H17V17"
                stroke="#F8F8F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 17L17 7"
                stroke="#F8F8F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}