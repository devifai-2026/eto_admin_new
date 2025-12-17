import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  FiPlus,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiMap,
  FiGlobe,
  FiCreditCard,
  FiFileText,
  FiUpload,
  FiX,
  FiHome as FiBuilding,
  FiTrash2,
  FiEdit2,
  FiSave,
} from "react-icons/fi";
import { TbKeyframeAlignCenter } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import franchiseAPI from "../../../apis/franchise";

const MySwal = withReactContent(Swal);

const AddFranchise = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!franchiseId && franchiseId !== "add";

  const [showForm, setShowForm] = useState(!isEditMode);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [mode, setMode] = useState(isEditMode ? "edit" : "create");

  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    contactNo: "",

    // Address
    address: {
      street: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      landmark: "",
    },

    // Bank Details
    bankDetails: {
      accountNo: "",
      ifscCode: "",
      branchName: "",
      accountHolderName: "",
    },

    // Documents
    identityDocuments: [],
    tradeLicense: null,

    // Existing Documents URLs (for edit mode)
    existingIdentityDocs: [],
    existingTradeLicense: null,

    // Description
    description: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Load franchise data for edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchFranchiseData();
    }
  }, [franchiseId]);

  const fetchFranchiseData = async () => {
    try {
      setInitialLoading(true);
      const response = await franchiseAPI.getFranchiseById(franchiseId);

      if (response.success && response.data?.franchise) {
        const franchise = response.data.franchise;

        // Convert backend data to frontend format
        const formattedData = {
          name: franchise.name || "",
          email: franchise.email || "",
          contactNo: franchise.phone || "",
          address: {
            street: franchise.address?.street_address || "",
            city: franchise.address?.city || "",
            state: franchise.address?.state || "",
            country: franchise.address?.country || "India",
            pincode: franchise.address?.pincode || "",
            landmark: franchise.address?.landmark || "",
          },
          bankDetails: {
            accountNo: franchise.bank_details?.account_number || "",
            ifscCode: franchise.bank_details?.ifsc_code || "",
            branchName: franchise.bank_details?.branch_name || "",
            accountHolderName:
              franchise.bank_details?.account_holder_name || "",
          },
          identityDocuments: [],
          tradeLicense: null,
          existingIdentityDocs: franchise.documents?.identity_documents || [],
          existingTradeLicense: franchise.documents?.trade_license || null,
          description: franchise.description || "",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error fetching franchise:", error);
      showErrorAlert(
        "Failed to Load",
        "Failed to load franchise data. Please try again."
      );
      navigate("/all-franchise");
    } finally {
      setInitialLoading(false);
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!originalData) return true;

    const simpleCompare = (obj1, obj2) => {
      return JSON.stringify(obj1) !== JSON.stringify(obj2);
    };

    const basicDataChanged =
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.contactNo !== originalData.contactNo ||
      formData.description !== originalData.description;

    const addressChanged = simpleCompare(
      formData.address,
      originalData.address
    );
    const bankChanged = simpleCompare(
      formData.bankDetails,
      originalData.bankDetails
    );
    const docsChanged =
      formData.identityDocuments.length > 0 || formData.tradeLicense !== null;

    return basicDataChanged || addressChanged || bankChanged || docsChanged;
  };

  const showSuccessAlert = (title, text) => {
    MySwal.fire({
      title: <p className="text-2xl font-bold">{title}</p>,
      text: text,
      icon: "success",
      iconColor: "#10B981",
      confirmButtonColor: "#3B82F6",
      confirmButtonText: "OK",
      background: "#ffffff",
      color: "#1F2937",
      customClass: {
        popup: "rounded-xl shadow-xl",
        title: "text-gray-900",
        confirmButton: "px-4 py-2 rounded-lg font-medium",
      },
    });
  };

  const showErrorAlert = (title, text) => {
    MySwal.fire({
      title: <p className="text-2xl font-bold">{title}</p>,
      text: text,
      icon: "error",
      iconColor: "#EF4444",
      confirmButtonColor: "#3B82F6",
      confirmButtonText: "Try Again",
      background: "#ffffff",
      color: "#1F2937",
      customClass: {
        popup: "rounded-xl shadow-xl",
        title: "text-gray-900",
        confirmButton: "px-4 py-2 rounded-lg font-medium",
      },
    });
  };

  const showWarningAlert = (title, text, onConfirm) => {
    MySwal.fire({
      title: <p className="text-2xl font-bold">{title}</p>,
      text: text,
      icon: "warning",
      iconColor: "#F59E0B",
      showCancelButton: true,
      confirmButtonColor: isEditMode ? "#10B981" : "#3B82F6",
      cancelButtonColor: "#6B7280",
      confirmButtonText: isEditMode ? "Yes, Update" : "Yes, Continue",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#1F2937",
      customClass: {
        popup: "rounded-xl shadow-xl",
        title: "text-gray-900",
        confirmButton: "px-4 py-2 rounded-lg font-medium",
        cancelButton: "px-4 py-2 rounded-lg font-medium",
      },
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });
  };

  const handleInputChange = (section, field, value) => {
    let processedValue = value;

    switch (field) {
      case "contactNo":
        processedValue = value.replace(/\D/g, "").slice(0, 10);
        break;
      case "pincode":
        processedValue = value.replace(/\D/g, "").slice(0, 6);
        break;
      case "accountNo":
        processedValue = value.replace(/\D/g, "").slice(0, 18);
        break;
      case "ifscCode":
        processedValue = value
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase()
          .slice(0, 11);
        break;
      default:
        processedValue = value;
    }

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: processedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: processedValue,
      }));
    }
  };

  // Handle file upload for edit mode - replace existing
  const handleIdentityDocumentsChange = (files) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      // Validate file types and sizes
      const invalidFiles = [];
      const validFiles = newFiles.filter((file) => {
        const isValidType = [
          "image/jpeg",
          "image/png",
          "application/pdf",
        ].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024;

        if (!isValidType) {
          invalidFiles.push(
            `${file.name}: Invalid file type. Only JPG, PNG, PDF allowed.`
          );
          return false;
        }
        if (!isValidSize) {
          invalidFiles.push(
            `${file.name}: File too large. Maximum size is 5MB.`
          );
          return false;
        }
        return true;
      });

      if (invalidFiles.length > 0) {
        showErrorAlert("File Upload Error", invalidFiles.join("\n"));
      }

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          identityDocuments: [...prev.identityDocuments, ...validFiles],
        }));

        showSuccessAlert(
          "Files Added",
          `${validFiles.length} identity document(s) added for update`
        );
      }
    }
  };

  const removeIdentityDocument = (index, type = "new") => {
    const fileName =
      type === "new"
        ? formData.identityDocuments[index]?.name
        : formData.existingIdentityDocs[index]?.split("/").pop();

    showWarningAlert(
      "Remove Document",
      `Are you sure you want to remove "${fileName}"?`,
      () => {
        if (type === "new") {
          setFormData((prev) => ({
            ...prev,
            identityDocuments: prev.identityDocuments.filter(
              (_, i) => i !== index
            ),
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            existingIdentityDocs: prev.existingIdentityDocs.filter(
              (_, i) => i !== index
            ),
          }));
        }

        showSuccessAlert("Document Removed", `${fileName} has been removed.`);
      }
    );
  };

  const handleTradeLicenseChange = (file) => {
    if (file) {
      const isValidType = [
        "image/jpeg",
        "image/png",
        "application/pdf",
      ].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        showErrorAlert(
          "Invalid File Type",
          "Invalid file type for trade license. Only JPG, PNG, PDF allowed."
        );
        return;
      }
      if (!isValidSize) {
        showErrorAlert(
          "File Too Large",
          "Trade license file too large. Maximum size is 5MB."
        );
        return;
      }

      setFormData((prev) => ({
        ...prev,
        tradeLicense: file,
        existingTradeLicense: null, // Clear existing if new one uploaded
      }));

      showSuccessAlert(
        "Trade License Updated",
        "New trade license added for update"
      );
    }
  };

  const removeTradeLicense = (type = "new") => {
    showWarningAlert(
      "Remove Trade License",
      `Are you sure you want to remove the trade license?`,
      () => {
        if (type === "new") {
          setFormData((prev) => ({
            ...prev,
            tradeLicense: null,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            existingTradeLicense: null,
          }));
        }
        showSuccessAlert("Removed", "Trade license removed");
      }
    );
  };

const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateForm = () => {
    // Required fields for create mode
    if (mode === "create") {
      const requiredFields = [
        { field: formData.name, message: "Name is required" },
        { field: formData.email, message: "Email is required" },
        { field: formData.contactNo, message: "Contact number is required" },
        {
          field: formData.address.street,
          message: "Street address is required",
        },
        { field: formData.address.city, message: "City is required" },
        { field: formData.address.state, message: "State is required" },
        { field: formData.address.pincode, message: "Pincode is required" },
        {
          field: formData.bankDetails.accountHolderName,
          message: "Account holder name is required",
        },
        {
          field: formData.bankDetails.accountNo,
          message: "Account number is required",
        },
        {
          field: formData.bankDetails.ifscCode,
          message: "IFSC code is required",
        },
        {
          field: formData.bankDetails.branchName,
          message: "Branch name is required",
        },
      ];

      for (const reqField of requiredFields) {
        if (!reqField.field || reqField.field.trim() === "") {
          showErrorAlert("Missing Information", reqField.message);
          return false;
        }
      }

      // Document validation for create mode
      if (formData.identityDocuments.length === 0) {
        showErrorAlert(
          "Missing Documents",
          "At least one identity document is required"
        );
        return false;
      }

      if (!formData.tradeLicense) {
        showErrorAlert(
          "Missing Trade License",
          "Trade license document is required"
        );
        return false;
      }
    }

    // Common validations for both modes
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showErrorAlert("Invalid Email", "Please enter a valid email address");
      return false;
    }

    // Phone validation for edit mode (if changed)
    if (formData.contactNo && formData.contactNo !== originalData?.contactNo) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.contactNo)) {
        showErrorAlert(
          "Invalid Phone Number",
          "Please enter a valid 10-digit phone number"
        );
        return false;
      }
    }

    // Pincode validation
    if (formData.address.pincode) {
      const pincodeRegex = /^[0-9]{6}$/;
      if (!pincodeRegex.test(formData.address.pincode)) {
        showErrorAlert(
          "Invalid PIN Code",
          "Please enter a valid 6-digit pincode"
        );
        return false;
      }
    }

    // IFSC code validation
    if (formData.bankDetails.ifscCode) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      const ifscCode = formData.bankDetails.ifscCode.toUpperCase();
      if (ifscCode.length !== 11) {
        showErrorAlert(
          "Invalid IFSC Code",
          "IFSC code must be exactly 11 characters"
        );
        return false;
      }
      if (!ifscRegex.test(ifscCode)) {
        showErrorAlert(
          "Invalid IFSC Code Format",
          "IFSC code must be in the format: XXXX0XXXXXX (e.g., SBIN0001234)"
        );
        return false;
      }
    }

    // Account number validation
    if (formData.bankDetails.accountNo) {
      const accountNo = formData.bankDetails.accountNo;
      if (accountNo.length < 9 || accountNo.length > 18) {
        showErrorAlert(
          "Invalid Account Number Length",
          "Account number must be between 9 to 18 digits"
        );
        return false;
      }
      const accountRegex = /^[0-9]+$/;
      if (!accountRegex.test(accountNo)) {
        showErrorAlert(
          "Invalid Account Number",
          "Account number can only contain numbers"
        );
        return false;
      }
    }

    // Document validation for edit mode
    if (mode === "edit") {
      const hasIdentityDocs =
        formData.existingIdentityDocs.length > 0 ||
        formData.identityDocuments.length > 0;
      const hasTradeLicense =
        formData.existingTradeLicense || formData.tradeLicense;

      if (!hasIdentityDocs) {
        showErrorAlert(
          "Missing Documents",
          "At least one identity document is required"
        );
        return false;
      }

      if (!hasTradeLicense) {
        showErrorAlert(
          "Missing Trade License",
          "Trade license document is required"
        );
        return false;
      }
    }

    return true;
  };

  const handleCreateFranchise = async () => {
    try {
      // Step 1: Create franchise
      const franchiseResponse = await franchiseAPI.createFranchise(formData);

      if (franchiseResponse.success && franchiseResponse.data) {
        const franchiseId = franchiseResponse.data.franchise._id;

        // Step 2: Upload documents
        const documents = {
          identityDocuments: formData.identityDocuments,
          tradeLicense: formData.tradeLicense,
        };

        await franchiseAPI.uploadFranchiseDocuments(franchiseId, documents);

        showSuccessAlert(
          "Franchise Created Successfully!",
          "The franchise has been created and documents uploaded successfully."
        );

        // Reset and redirect
        setTimeout(() => {
          resetForm();
          navigate("/all-franchise");
        }, 2000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create franchise. Please try again.";
      showErrorAlert("Error Creating Franchise", errorMsg);
      throw error;
    }
  };

  const handleUpdateFranchise = async () => {
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        address: {
          street_address: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country,
          pincode: formData.address.pincode,
          district: formData.address.city,
        },
        bank_details: {
          account_holder_name: formData.bankDetails.accountHolderName,
          account_number: formData.bankDetails.accountNo,
          ifsc_code: formData.bankDetails.ifscCode,
          branch_name: formData.bankDetails.branchName,
        },
        description: formData.description,
      };

      // Update basic info
      await franchiseAPI.updateFranchise(franchiseId, updateData);

      // Upload new documents if any
      if (formData.identityDocuments.length > 0 || formData.tradeLicense) {
        const documents = {
          identityDocuments: formData.identityDocuments,
          tradeLicense: formData.tradeLicense,
        };
        await franchiseAPI.uploadFranchiseDocuments(franchiseId, documents);
      }

      showSuccessAlert(
        "Franchise Updated Successfully!",
        "The franchise has been updated successfully."
      );

      // Redirect back
      setTimeout(() => {
        navigate(`/franchise-details/${franchiseId}`);
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update franchise. Please try again.";
      showErrorAlert("Error Updating Franchise", errorMsg);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if there are changes for edit mode
    if (mode === "edit" && !hasChanges()) {
      showErrorAlert("No Changes", "No changes detected to update.");
      return;
    }

    const actionText = mode === "edit" ? "update" : "create";
    showWarningAlert(
      `Confirm ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      `Are you sure you want to ${actionText} this franchise?`,
      async () => {
        setLoading(true);

        MySwal.fire({
          title: (
            <p className="text-2xl font-bold">
              {mode === "edit" ? "Updating Franchise" : "Creating Franchise"}
            </p>
          ),
          text: `Please wait while we ${actionText} the franchise...`,
          icon: "info",
          iconColor: "#3B82F6",
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          background: "#ffffff",
          color: "#1F2937",
          customClass: {
            popup: "rounded-xl shadow-xl",
            title: "text-gray-900",
          },
          didOpen: () => {
            MySwal.showLoading();
          },
        });

        try {
          if (mode === "edit") {
            await handleUpdateFranchise();
          } else {
            await handleCreateFranchise();
          }
          MySwal.close();
        } catch (error) {
          MySwal.close();
          // Error already handled in individual functions
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      contactNo: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        landmark: "",
      },
      bankDetails: {
        accountNo: "",
        ifscCode: "",
        branchName: "",
        accountHolderName: "",
      },
      identityDocuments: [],
      tradeLicense: null,
      existingIdentityDocs: [],
      existingTradeLicense: null,
      description: "",
    });
    setOriginalData(null);
  };

  const closeForm = () => {
    if (hasChanges()) {
      showWarningAlert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to leave?",
        () => {
          if (isEditMode) {
            navigate(`/franchise-details/${franchiseId}`);
          } else {
            setShowForm(false);
          }
        }
      );
    } else {
      if (isEditMode) {
        navigate(`/franchise-details/${franchiseId}`);
      } else {
        setShowForm(false);
      }
    }
  };

  const IdentityDocumentsUpload = () => (
    <div className="space-y-4">
      {/* Existing Documents (for edit mode) */}
      {isEditMode && formData.existingIdentityDocs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Existing Identity Documents ({formData.existingIdentityDocs.length})
          </h5>
          <div className="space-y-2">
            {formData.existingIdentityDocs.map((docUrl, index) => {
              const fileName = docUrl.split("/").pop();
              return (
                <div
                  key={`existing-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FiFileText className="text-green-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {fileName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Existing Document
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                      title="View"
                    >
                      <FiUpload size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={() => removeIdentityDocument(index, "existing")}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                      title="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Documents Upload */}
      <div
        className={`bg-gray-50 dark:bg-gray-800 border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleIdentityDocumentsChange(e.dataTransfer.files);
          }
        }}
      >
        <input
          type="file"
          id="identityDocuments"
          className="hidden"
          accept="image/jpeg,image/png,application/pdf"
          multiple
          onChange={(e) => handleIdentityDocumentsChange(e.target.files)}
          disabled={loading}
        />
        <label
          htmlFor="identityDocuments"
          className={`cursor-pointer block ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {isEditMode
              ? "Add New Identity Documents"
              : "Upload Identity Documents"}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Drag & drop your documents here or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
            {isEditMode
              ? "New documents will replace existing ones"
              : "Accepted: Aadhar Card, PAN Card, Voter ID Card"}
            <br />
            Supported formats: JPG, PNG, PDF (Max 5MB each)
          </p>
          <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium">
            Choose Files
          </span>
        </label>
      </div>

      {/* New Uploaded Files List */}
      {formData.identityDocuments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            New Documents to Upload ({formData.identityDocuments.length})
          </h5>
          <div className="space-y-2">
            {formData.identityDocuments.map((file, index) => (
              <div
                key={`new-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FiFileText className="text-blue-500" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeIdentityDocument(index, "new")}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                  title="Remove"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const TradeLicenseUpload = () => (
    <div className="space-y-4">
      {/* Existing Trade License (for edit mode) */}
      {isEditMode && formData.existingTradeLicense && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Existing Trade License
          </h5>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FiFileText className="text-green-500" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formData.existingTradeLicense.split("/").pop()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Existing Trade License
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={formData.existingTradeLicense}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                title="View"
              >
                <FiUpload size={16} />
              </a>
              <button
                type="button"
                onClick={() => removeTradeLicense("existing")}
                disabled={loading}
                className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                title="Remove"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Trade License Upload */}
      <div
        className={`bg-gray-50 dark:bg-gray-800 border-2 ${
          dragActive
            ? "border-blue-500"
            : "border-gray-300 dark:border-gray-600"
        } border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-400`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleTradeLicenseChange(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          type="file"
          id="tradeLicense"
          className="hidden"
          accept="image/jpeg,image/png,application/pdf"
          onChange={(e) => handleTradeLicenseChange(e.target.files[0])}
          disabled={loading}
        />
        <label
          htmlFor="tradeLicense"
          className={`cursor-pointer block ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiFileText className="mx-auto text-3xl text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {formData.tradeLicense ? (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                ✓ {formData.tradeLicense.name}
              </span>
            ) : (
              "Drag & drop Trade License or click to browse"
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {isEditMode
              ? "New trade license will replace existing one"
              : "Supported formats: JPG, PNG, PDF (Max 5MB)"}
          </p>
        </label>
      </div>

      {/* New Trade License Preview */}
      {formData.tradeLicense && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            New Trade License to Upload
          </h5>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FiFileText className="text-blue-500" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formData.tradeLicense.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(formData.tradeLicense.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeTradeLicense("new")}
              disabled={loading}
              className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
              title="Remove"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Loading state for edit mode
  if (initialLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | {isEditMode ? "Edit Franchise" : "Add Franchise"}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <TbKeyframeAlignCenter className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? "Edit Franchise" : "Franchise Management"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "Update franchise partner information"
              : "Add and manage franchise partners for your business"}
          </p>
        </div>

        {/* Add Franchise Button (only for create mode) */}
        {!isEditMode && !showForm && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FiPlus className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Add New Franchise
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding a new franchise partner to your network
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <FiPlus size={20} />
                <span>Add Franchise</span>
              </button>
            </div>
          </div>
        )}

        {/* Franchise Form */}
        {(showForm || isEditMode) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Form Header */}
            <div
              className={`px-6 py-4 ${
                isEditMode
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TbKeyframeAlignCenter className="text-2xl text-white" />
                  <h2 className="text-xl font-semibold text-white">
                    {isEditMode ? "Edit Franchise" : "Add New Franchise"}
                  </h2>
                  {isEditMode && hasChanges() && (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                      Unsaved Changes
                    </span>
                  )}
                </div>
                <button
                  onClick={closeForm}
                  className="text-white hover:opacity-80 transition-opacity disabled:opacity-50"
                  disabled={loading}
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FiUser
                    className={isEditMode ? "text-green-600" : "text-blue-600"}
                  />
                  <span>Basic Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange(null, "name", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        required={!isEditMode}
                        disabled={loading || isEditMode}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          isEditMode ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange(null, "email", e.target.value)
                        }
                      />
                      {isEditMode && (
                        <p className="text-xs text-gray-500 mt-1">
                          Email cannot be changed
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Number * {isEditMode && "(Cannot be changed)"}
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        required={!isEditMode}
                        disabled={loading || isEditMode}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          isEditMode ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter 10-digit phone number"
                        value={formData.contactNo}
                        onChange={(e) => {
                          if (!isEditMode) {
                            handleInputChange(
                              null,
                              "contactNo",
                              e.target.value
                            );
                          }
                        }}
                        maxLength={10}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {formData.contactNo.length}/10
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FiMapPin
                    className={isEditMode ? "text-green-600" : "text-blue-600"}
                  />
                  <span>Address Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <FiHome className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        required={!isEditMode}
                        rows={3}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter complete street address"
                        value={formData.address.street}
                        onChange={(e) =>
                          handleInputChange("address", "street", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <FiMap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter city"
                        value={formData.address.city}
                        onChange={(e) =>
                          handleInputChange("address", "city", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter state"
                        value={formData.address.state}
                        onChange={(e) =>
                          handleInputChange("address", "state", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter country"
                        value={formData.address.country}
                        onChange={(e) =>
                          handleInputChange(
                            "address",
                            "country",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      PIN Code * (6 digits)
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter 6-digit PIN code"
                        value={formData.address.pincode}
                        onChange={(e) =>
                          handleInputChange(
                            "address",
                            "pincode",
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        maxLength={6}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {formData.address.pincode.length}/6
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FiCreditCard
                    className={isEditMode ? "text-green-600" : "text-blue-600"}
                  />
                  <span>Bank Account Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Holder Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter account holder name"
                        value={formData.bankDetails.accountHolderName}
                        onChange={(e) =>
                          handleInputChange(
                            "bankDetails",
                            "accountHolderName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Number * (9-18 digits)
                    </label>
                    <div className="relative">
                      <FaIndianRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter account number"
                        value={formData.bankDetails.accountNo}
                        onChange={(e) =>
                          handleInputChange(
                            "bankDetails",
                            "accountNo",
                            e.target.value.replace(/\D/g, "").slice(0, 18)
                          )
                        }
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {formData.bankDetails.accountNo.length}/18
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      IFSC Code * (11 characters)
                    </label>
                    <div className="relative">
                      <FiBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter IFSC code (e.g., SBIN0001234)"
                        value={formData.bankDetails.ifscCode}
                        onChange={(e) =>
                          handleInputChange(
                            "bankDetails",
                            "ifscCode",
                            e.target.value
                              .replace(/[^a-zA-Z0-9]/g, "")
                              .toUpperCase()
                              .slice(0, 11)
                          )
                        }
                        maxLength={11}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {formData.bankDetails.ifscCode.length}/11
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Branch Name *
                    </label>
                    <div className="relative">
                      <FiBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={!isEditMode}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        placeholder="Enter branch name"
                        value={formData.bankDetails.branchName}
                        onChange={(e) =>
                          handleInputChange(
                            "bankDetails",
                            "branchName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FiFileText className="text-orange-600" />
                  <span>Identity Documents</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {isEditMode
                    ? "Update identity documents (Aadhar Card, PAN Card, Voter ID Card)"
                    : "Upload Aadhar Card (Front & Back), PAN Card, and/or Voter ID Card"}
                </p>
                <IdentityDocumentsUpload />
              </div>

              {/* Trade License Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FiFileText className="text-red-600" />
                  <span>Trade License</span>
                </h3>
                <TradeLicenseUpload />
              </div>

              {/* Description Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FiFileText className="text-gray-600" />
                  <span>Additional Information</span>
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    placeholder="Enter any additional information about the franchise"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange(null, "description", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (isEditMode && !hasChanges())}
                  className={`px-6 py-3 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isEditMode
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <>
                      {isEditMode ? <FiSave size={18} /> : <FiPlus size={18} />}
                      <span>
                        {isEditMode ? "Update Franchise" : "Create Franchise"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFranchise;
