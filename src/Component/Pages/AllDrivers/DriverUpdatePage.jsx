import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiUser,
  FiMapPin,
  FiImage,
  FiX,
  FiEye,
  FiTrash2
} from "react-icons/fi";
import { allDriverAPI } from "../../../apis/AllDriver";
import loginAPI from "../../../apis/Login";
import Breadcrumbs from "../../Breadcrumbs/BreadCrumbs";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";

const DriverUpdatePage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Driver data state
  const [driverData, setDriverData] = useState({
    name: "",
    email: "",
    phone: "",
    village: "",
    police_station: "",
    landmark: "",
    post_office: "",
    district: "",
    pin_code: "",
    license_number: "",
    toto_license_number: "",
    driver_photo: "",
    car_photo: [],
    aadhar_front_photo: "",
    aadhar_back_photo: "",
  });

  // Upload states
  const [uploadField, setUploadField] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Get current admin info
  const getAdminInfo = () => {
    const user = loginAPI.getCurrentUser();
    const userType = loginAPI.getUserType();

    if (userType !== "admin") {
      navigate("/unauthorized");
      return null;
    }

    return user;
  };

  // Fetch driver data
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await allDriverAPI.getDriverById(driverId);
        console.log("Fetched Driver Data:", response);

        if (response.statusCode === 200) {
          const driver = response.data.driver;

          setDriverData({
            name: driver.name || "",
            email: driver.email || "",
            phone: driver.phone || "",
            village: driver.village || "",
            police_station: driver.police_station || "",
            landmark: driver.landmark || "",
            post_office: driver.post_office || "",
            district: driver.district || "",
            pin_code: driver.pin_code || "",
            license_number: driver.license_number || "",
            toto_license_number: driver.toto_license_number || "",
            driver_photo: driver.driver_photo || "",
            car_photo: Array.isArray(driver.car_photo) ? driver.car_photo : [],
            aadhar_front_photo: driver.aadhar_front_photo || "",
            aadhar_back_photo: driver.aadhar_back_photo || "",
          });
        } else {
          throw new Error(response.message || "Failed to fetch driver data");
        }
      } catch (err) {
        console.error("Error fetching driver:", err);
        setError(err.message || "Failed to load driver data");
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchDriverData();
    }
  }, [driverId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image URL changes
  const handleImageChange = (field, value) => {
    setDriverData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle car photos
  const handleCarPhotoChange = (index, value) => {
    setDriverData((prev) => ({
      ...prev,
      car_photo: prev.car_photo.map((photo, i) =>
        i === index ? value : photo
      ),
    }));
  };

  const addCarPhoto = () => {
    setDriverData((prev) => ({
      ...prev,
      car_photo: [...prev.car_photo, ""],
    }));
  };

  const removeCarPhoto = (index) => {
    setDriverData((prev) => ({
      ...prev,
      car_photo: prev.car_photo.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload - CORRECTED VERSION
  const handleImageUpload = async (field) => {
    try {
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // For mobile camera
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        setUploading(true);
        setUploadField(field);
        
        try {
          // Upload the file directly - no need to convert to URL first
          const cloudinaryUrl = await uploadImageToCloudinary(file);
          
          if (cloudinaryUrl) {
            // Update the corresponding field with Cloudinary URL
            if (field.startsWith('car_photo_')) {
              // For car photos
              const index = parseInt(field.split('_')[2]);
              handleCarPhotoChange(index, cloudinaryUrl);
            } else {
              // For other images
              handleImageChange(field, cloudinaryUrl);
            }
            setSuccess(`Image uploaded successfully!`);
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setError(uploadError.message || "Failed to upload image. Please try again.");
        } finally {
          setUploading(false);
          setUploadField(null);
          setPreviewImage(null);
        }
      };
      
      input.click();
    } catch (err) {
      console.error("Error selecting file:", err);
      setUploading(false);
      setUploadField(null);
      setError("Failed to select image. Please try again.");
    }
  };

  // Handle new car photo upload
  const handleNewCarPhotoUpload = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        
        try {
          const cloudinaryUrl = await uploadImageToCloudinary(file);
          
          if (cloudinaryUrl) {
            // Add new car photo with Cloudinary URL
            setDriverData(prev => ({
              ...prev,
              car_photo: [...prev.car_photo, cloudinaryUrl]
            }));
            setSuccess('Car photo uploaded successfully!');
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setError(uploadError.message || "Failed to upload image. Please try again.");
        } finally {
          setUploading(false);
        }
      };
      
      input.click();
    } catch (err) {
      console.error("Error:", err);
      setUploading(false);
      setError("Failed to select image. Please try again.");
    }
  };

  // Open image in new tab
  const openImageInNewTab = (url) => {
    if (url) {
      setCurrentImageUrl(url);
      setImageModalOpen(true);
    }
  };

  // Close image modal
  const closeImageModal = () => {
    setImageModalOpen(false);
    setCurrentImageUrl("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const admin = getAdminInfo();
    if (!admin) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Prepare update data
      const updateData = { ...driverData };

      // Remove empty car photos
      updateData.car_photo = updateData.car_photo.filter(
        (photo) => photo.trim() !== ""
      );

      const response = await allDriverAPI.updateDriver(
        driverId,
        updateData,
        admin._id
      );

      if (response.statusCode === 200) {
        setSuccess("Driver updated successfully!");

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/all-drivers");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to update driver");
      }
    } catch (err) {
      console.error("Error updating driver:", err);
      setError(err.message || "Failed to update driver. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Image upload button component - UPDATED VERSION
  const ImageUploadButton = ({ field, label, currentUrl }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={currentUrl ? "✓ Image uploaded" : "No image uploaded"}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-default"
          />
          {currentUrl && (
            <button
              type="button"
              onClick={() => openImageInNewTab(currentUrl)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
              title="View image"
            >
              <FiEye size={18} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleImageUpload(field)}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <FiUpload className="mr-2" />
          {uploading && uploadField === field ? "Uploading..." : currentUrl ? "Change" : "Upload"}
        </button>
        {currentUrl && (
          <button
            type="button"
            onClick={() => handleImageChange(field, "")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            title="Remove image"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading driver data...
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate("/all-drivers")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Drivers List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Update Driver</title>
      </Helmet>

      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Update Driver
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Edit driver information and upload images
            </p>
          </div>
          <button
            onClick={() => navigate("/all-drivers")}
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Drivers
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {imageModalOpen && currentImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Image Preview
              </h3>
              <div className="flex items-center space-x-2">
                <a
                  href={currentImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Open in New Tab
                </a>
                <button
                  onClick={closeImageModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <FiX size={24} className="text-gray-800 dark:text-white" />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={currentImageUrl}
                alt="Preview"
                className="max-w-full max-h-[70vh] rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-64 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div class="text-gray-400 mb-2">Image not available</div>
                      <a href="${currentImageUrl}" target="_blank" rel="noopener noreferrer" 
                         class="text-blue-600 dark:text-blue-400 hover:underline">
                        Open link directly
                      </a>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Upload Preview
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FiX size={24} />
              </button>
            </div>
            <img
              src={previewImage}
              alt="Upload Preview"
              className="w-full h-auto rounded-lg mb-4"
            />
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Uploading to {uploadField?.replace('_', ' ')}...
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center text-green-700 dark:text-green-400">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center text-red-700 dark:text-red-400">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Update Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Personal Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={driverData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={driverData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={driverData.phone}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Phone number cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={driverData.pin_code}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PIN Code cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Driver License Number
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={driverData.license_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toto License Number
                </label>
                <input
                  type="text"
                  name="toto_license_number"
                  value={driverData.toto_license_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Address Information */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FiMapPin className="mr-2" />
                  Address Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Village *
                </label>
                <input
                  type="text"
                  name="village"
                  value={driverData.village}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Police Station *
                </label>
                <input
                  type="text"
                  name="police_station"
                  value={driverData.police_station}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Landmark *
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={driverData.landmark}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Office *
                </label>
                <input
                  type="text"
                  name="post_office"
                  value={driverData.post_office}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  value={driverData.district}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                {/* Empty div for grid alignment */}
              </div>

              {/* Image Uploads */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FiImage className="mr-2" />
                  Document Images
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Upload images to Cloudinary. Click the eye icon to view images.
                </p>
              </div>

              {/* Driver Photo */}
              <ImageUploadButton
                field="driver_photo"
                label="Driver Photo"
                currentUrl={driverData.driver_photo}
              />

              {/* Aadhar Front Photo */}
              <ImageUploadButton
                field="aadhar_front_photo"
                label="Aadhar Front Photo"
                currentUrl={driverData.aadhar_front_photo}
              />

              {/* Aadhar Back Photo */}
              <ImageUploadButton
                field="aadhar_back_photo"
                label="Aadhar Back Photo"
                currentUrl={driverData.aadhar_back_photo}
              />

              {/* Car Photos */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Car Photos
                </label>
                <div className="space-y-4">
                  {driverData.car_photo.map((photo, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Car Photo {index + 1}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => openImageInNewTab(photo)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center text-sm"
                            disabled={!photo}
                          >
                            <FiEye className="mr-1" size={14} />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImageUpload(`car_photo_${index}`)}
                            disabled={uploading}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm"
                          >
                            <FiUpload className="mr-1" size={14} />
                            {photo ? "Change" : "Upload"}
                          </button>
                          {driverData.car_photo.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCarPhoto(index)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center text-sm"
                            >
                              <FiTrash2 className="mr-1" size={14} />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      {photo && (
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                              src={photo}
                              alt={`Car photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onClick={() => openImageInNewTab(photo)}
                              style={{ cursor: 'pointer' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                  <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                                    <div>No Image</div>
                                    <button onclick="window.open('${photo}', '_blank')" 
                                            class="mt-1 text-blue-600 dark:text-blue-400 text-xs">
                                      Open Link
                                    </button>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Click image to view in full size
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={handleNewCarPhotoUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <FiUpload className="mr-2" />
                    {uploading ? "Uploading..." : "Upload New Car Photo"}
                  </button>
                  <button
                    type="button"
                    onClick={addCarPhoto}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    + Add Empty Slot
                  </button>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/all-drivers")}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSave className="mr-2" />
                  {saving ? "Saving..." : "Update Driver"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Driver Info Summary */}
      {driverData && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Current Driver Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Driver ID
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {driverId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {driverData.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Documents Status
              </p>
              <p className={`font-medium ${driverData.driver_photo && driverData.aadhar_front_photo && driverData.aadhar_back_photo ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {driverData.driver_photo && driverData.aadhar_front_photo && driverData.aadhar_back_photo ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverUpdatePage;