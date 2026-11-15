import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { BiLockAlt } from "react-icons/bi";
import { IoMailOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { profileBg } from "../../assets";
import { CircularProgress, Avatar as MuiAvatar } from "@mui/material";
import { useDispatch, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials, logOut, sameSession } from "../../features/auth/authSlice";
import uploadImage from "../../common/uploadImage";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../features/user/userApiSlice";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Profile = () => {
  const user = useAuth();
  useTitle("Recipen - Profile");

  const [formDetails, setFormDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: "",
    removeProfilePicture: false,
    password: "",
    currentPassword: "",
  });

  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const dispatch = useDispatch();
  const store = useStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfileError("");
    setPasswordError("");
    if (e.target.id === "image") {
      setFormDetails((current) => ({ ...current, removeProfilePicture: false }));
      uploadImage(e, setProgress, setFormDetails, setUploadError);
    } else {
      setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e, changePassword = false) => {
    e.preventDefault();
    if (changePassword) setPasswordError(""); else setProfileError("");
    const startingToken = store.getState().auth.token;

    try {
      const updatedUser = await toast.promise(
        updateUser(changePassword ? { userId: user?.userId, name: user?.name, email: user?.email, password: formDetails.password, currentPassword: formDetails.currentPassword } : { ...formDetails, password: "", currentPassword: emailPassword, userId: user?.userId }).unwrap(),
        {
          pending: "Please wait...",
          success: "User updated successfully",
          error: { render: ({ data: error }) => error?.data?.message || "Unable to update user" },
        }
      );
      if (!sameSession(store.getState().auth.token, startingToken)) return;
      if (changePassword && formDetails.password) {
        dispatch(logOut());
        localStorage.setItem("persist", false);
        toast.info("Password changed. Please sign in again.");
        navigate("/auth/signin", { replace: true });
        return;
      }
      setFormDetails({
        name: formDetails?.name,
        email: formDetails?.email,
        image: "",
        removeProfilePicture: false,
        password: "",
        currentPassword: "",
      });
      setEmailPassword("");
      dispatch(setCredentials({ ...updatedUser }));
    } catch (error) {
      const message = error?.data?.message || "Could not save your changes. Check your connection and try again.";
      if (changePassword) setPasswordError(message); else setProfileError(message);
    }
  };

  return (
    <section className="box max-w-5xl pt-6 md:pt-10">
      {/* Profile heading */}
      <div className="mb-8 border-b border-[#e8e1d7] pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Your account</p>
        <h1 className="mt-3 font-serif text-4xl text-[#29251f]">Profile</h1>
        <p className="mt-2 text-sm text-[#6b6257]">
          You can update your profile details here
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)] md:items-start">
        {/* Profile form */}
        <form
          className="flex min-w-0 flex-col gap-5 rounded-2xl border border-[#e8e1d7] bg-white p-6 sm:p-8"
          onSubmit={(event) => handleSubmit(event)}
        >
          {profileError && <p role="alert" className="text-sm text-red-700">{profileError}</p>}
          {/* Upload image */}
          <div className="flex flex-wrap gap-5 items-center border-b border-[#eee7dc] pb-6">
            {progress > 0 && progress < 100 ? (
              <CircularProgress
                color="warning"
                size={30}
              />
            ) : (
              <MuiAvatar
                alt={user?.name}
                src={formDetails.removeProfilePicture ? "" : formDetails.image || user?.profilePicture}
                sx={{ width: 80, height: 80 }}
                className="border-2 border-primary"
              />
            )}

            <div className="flex flex-col">
              <label
                htmlFor="image"
                className="cursor-pointer rounded-lg border border-[#cfc6ba] px-4 py-2 text-sm font-semibold text-[#493b2b]"
              >
                Change photo
              </label>
              <input
                type="file"
                onChange={handleChange}
                id="image"
                accept="image/jpeg,image/png"
                aria-describedby={uploadError ? "profile-image-error" : undefined}
                className="sr-only"
              />
              {uploadError && <p id="profile-image-error" role="alert" className="mt-2 text-sm text-red-700">{uploadError}</p>}
              {(formDetails.image || user?.profilePicture) && !formDetails.removeProfilePicture && <button type="button" onClick={() => setFormDetails((current) => ({ ...current, image: "", removeProfilePicture: true }))} className="mt-2 text-left text-sm font-semibold underline">Remove photo</button>}
              {formDetails.removeProfilePicture && <button type="button" onClick={() => setFormDetails((current) => ({ ...current, removeProfilePicture: false }))} className="mt-2 text-left text-sm font-semibold underline">Undo removal</button>}
            </div>
          </div>
          <Input
            type={"text"}
            id={"name"}
            icon={<AiOutlineUser />}
            handleChange={handleChange}
            value={formDetails.name}
            label={"Full Name"}
            placeholder={"John Doe"}
          />
          <Input
            type={"email"}
            id={"email"}
            icon={<IoMailOutline />}
            handleChange={handleChange}
            value={formDetails.email}
            label={"Email"}
            placeholder={"example@abc.com"}
          />
          {formDetails.email.trim().toLowerCase() !== (user?.email || "").trim().toLowerCase() && (
            <Input type="password" id="emailPassword" icon={<BiLockAlt />} handleChange={(event) => { setProfileError(""); setEmailPassword(event.target.value); }} value={emailPassword} label="Current password" placeholder="Required to change your email" />
          )}
          <Button
            type="submit"
            content={"Save changes"}
            customCss={"max-w-max rounded-xl !bg-[#29251f] !px-6 !py-3 !text-white !shadow-none"}
            loading={isLoading || (progress > 0 && progress < 100)}
          />
        </form>
        {/* Profile banner */}
        <div className="hidden rounded-2xl bg-[#f8f1e5] p-8 md:block">
          <img
            src={profileBg}
            alt="profile page banner"
          />
        </div>
      </div>
      <form onSubmit={(event) => handleSubmit(event, true)} className="mt-8 max-w-xl space-y-5 rounded-2xl border border-[#e8e1d7] bg-white p-6 sm:p-8">
        {passwordError && <p role="alert" className="text-sm text-red-700">{passwordError}</p>}
        <h2 className="font-serif text-2xl">Change password</h2>
        <p className="text-sm text-[#6b6257]">Changing your password signs you out of your sessions.</p>
        <Input type="password" id="currentPassword" icon={<BiLockAlt />} handleChange={handleChange} value={formDetails.currentPassword} label="Current password" placeholder="Enter current password" />
        <Input type="password" id="password" icon={<BiLockAlt />} handleChange={handleChange} value={formDetails.password} label="New password" placeholder="New password" pattern=".{8,}" errorMessage="Use at least 8 characters and at most 72 bytes." helpText="Use at least 8 characters and at most 72 bytes. Some characters use more than one byte." />
        <Button type="submit" content="Change password" loading={isLoading} customCss="max-w-max rounded-xl !bg-[#29251f] !px-6 !py-3 !text-white !shadow-none" />
      </form>
    </section>
  );
};

export default Profile;
