// utils/cloudinary.js
export const uploadImageToCloudinary = async (imageUri) => {
  try {
    // Cloudinary upload preset and cloud name
    const uploadPreset = "easy toto operator";
    const cloudName = "dl478jwyt";

    // For web (React) - different handling than React Native
    if (typeof window !== "undefined") {
      // Web version - imageUri can be File, Blob, or data URL
      let file;

      // If imageUri is already a File object (from file input)
      if (imageUri instanceof File || imageUri instanceof Blob) {
        file = imageUri;
      }
      // If imageUri is a data URL (from FileReader)
      else if (imageUri.startsWith("data:")) {
        // Convert data URL to blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        // Create a File object from blob
        file = new File([blob], "upload.jpg", { type: blob.type || "image/jpeg" });
      }
      // For any other case (shouldn't happen with our implementation)
      else {
        throw new Error("Unsupported file format");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("Cloudinary upload error:", data);
        throw new Error(data.error?.message || "Upload failed");
      }
    } else {
      // React Native version
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("Cloudinary upload error:", data);
        throw new Error(data.error?.message || "Upload failed");
      }
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};