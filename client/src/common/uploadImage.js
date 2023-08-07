import axios from "axios";

const uploadImage = async (e, setProgress, setFormDetails, formDetails) => {
  if (
    e.target.files[0].type === "image/jpeg" ||
    e.target.files[0].type === "image/png"
  ) {
    const data = new FormData();
    data.append("file", e.target.files[0]);

    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    const config = {
      onUploadProgress: (e) => {
        const { loaded, total } = e;
        setProgress((loaded / total) * 100);
      },
    };

    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const {
      data: { url },
    } = await axios.post(
      import.meta.env.VITE_CLOUDINARY_BASE_URL,
      data,
      config
    );
    setFormDetails({ ...formDetails, [e.target.id]: url });
  } else {
    console.error("Please select an image in jpeg or png format");
  }
};

export default uploadImage;
