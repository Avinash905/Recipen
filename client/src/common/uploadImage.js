import axios from "axios";
const uploadImage = async (e, setProgress, setFormDetails, setUploadError) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploadError("");
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    setUploadError("Please select a JPEG or PNG image.");
    e.target.value = "";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    setUploadError("Choose an image no larger than 5 MB.");
    e.target.value = "";
    return;
  }

  const field = e.target.id;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
  data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    setProgress(1);
    const response = await axios.post(import.meta.env.VITE_CLOUDINARY_BASE_URL, data, {
      onUploadProgress: ({ loaded, total }) => {
        if (total) setProgress(Math.min(99, (loaded / total) * 100));
      },
    });
    const url = response.data.secure_url || response.data.url;
    if (!url) throw new Error("Missing image URL");
    setFormDetails((current) => ({ ...current, [field]: url }));
    setProgress(100);
  } catch (error) {
    setProgress(0);
    setUploadError("Image upload failed. Please try again.");
    e.target.value = "";
  }
};

export default uploadImage;
