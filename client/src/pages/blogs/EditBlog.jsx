import useCreatorDraft from "../../hooks/useCreatorDraft";
import useTitle from "../../hooks/useTitle";
import { useEffect, useRef, useState } from "react";
import Button from "../../components/button/Button";
import ComponentLoading from "../../components/loading/ComponentLoading";
import { photo } from "../../assets";
import uploadImage from "../../common/uploadImage";
import { LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
} from "../../features/blog/blogApiSlice";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const EditBlog = () => {
  useTitle("Recipen - Edit story");
  const { id } = useParams();
  const initializedId = useRef(null);

  const { data, ...rest } = useGetBlogQuery(id);
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const [formDetails, setFormDetails] = useState({
    title: data?.title || "",
    image: data?.image || "",
    description: data?.description || "",
  });
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [focused, setFocused] = useState({
    title: "",
  });

  useEffect(() => {
    if (data && data._id === id && initializedId.current !== id) {
      initializedId.current = id;
      setFormDetails({
        title: data?.title,
        image: data?.image,
        description: data?.description,
      });
    }
  }, [data, id]);

  const { status: draftStatus, markSaved, dirty: hasDraft, discardDraft } = useCreatorDraft(`blog:edit:${id}`, formDetails, setFormDetails, Boolean(data && initializedId.current === id));

  const handleFocus = (e) => {
    setFocused({ ...focused, [e.target.id]: true });
  };

  const handleChange = (e) => {
    setFormError("");
    if (e.target.id === "image") {
      uploadImage(e, setProgress, setFormDetails, setUploadError);
    } else {
      setFormDetails({ ...formDetails, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (progress > 0 && progress < 100) return toast.info("Wait for the image upload to finish.");

    if (!formDetails.description.trim() || !formDetails.image) {
      const target = !formDetails.description.trim() ? "description" : "image";
      setFormError(target === "image" ? "Choose a story image." : "Enter your story content.");
      document.getElementById(target)?.focus();
      return;
    }
    setFormError("");

    try {
      await toast.promise(
        updateBlog({ ...formDetails, blogId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Story updated successfully",
          error: { render: ({ data: error }) => error?.data?.message || "Unable to update story" },
        }
      );
      markSaved(formDetails);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="creator-editor box max-w-6xl pt-6 md:pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Your stories</p><h1 className="mt-3 font-serif text-4xl">Edit story</h1><p className="mt-2 text-[#6b6257]">Update your story and cover image.</p>
      {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
      {draftStatus && <p role="status" className="mt-3 text-sm text-[#6b6257]">{draftStatus}</p>}
      {hasDraft && <button type="button" onClick={discardDraft} className="mt-2 text-sm font-semibold underline">Discard unsaved changes</button>}
      <hr />
      {rest.isLoading ? (
        <ComponentLoading />
      ) : rest.isError || !data ? (
        <div className="mt-8 rounded-xl bg-[#f8f3eb] p-6" role="alert"><p>{rest.error?.status === 404 ? "This story could not be found." : "Could not load this story. Please try again."}</p>{rest.error?.status !== 404 && <button type="button" className="mt-3 mr-4 underline" onClick={rest.refetch}>Try again</button>}<Link to="/blog/my-blogs" className="mt-3 inline-block underline">Back to my stories</Link></div>
      ) : (
        <form
          className="mt-8 flex flex-col gap-8 md:flex-row md:items-start"
          onSubmit={handleSubmit}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-2xl border border-[#e8e1d7] bg-white p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="title"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Story title
              </label>
              <div className="flex flex-col basis-1/2">
                <input
                  type="text"
                  onChange={handleChange}
                  value={formDetails.title}
                  id="title"
                maxLength={200}
                  name="title"
                  onBlur={handleFocus}
                  data-focused={focused.title.toString()}
                  pattern={".*\\S.*"}
                  required
                  aria-required="true"
                  aria-describedby="title-error"
                  placeholder="Enter story title"
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
                />
                <span
                  id="title-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Enter a title that is not blank.
                </span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-3 justify-between">
              <label
                htmlFor="description"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Content
              </label>
              <div className="flex flex-col basis-1/2">
                <textarea
                  type="text"
                  onChange={handleChange}
                  value={formDetails.description}
                  id="description"
                maxLength={50000}
                  required
                  rows="10"
                  aria-required="true"
                  placeholder="Write your story here..."
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
                ></textarea>
                <div className="mt-5 rounded-xl bg-[#fbf8f3] p-4"><h2 className="text-sm font-semibold">Preview</h2><div className="recipen-article mt-3"><ReactMarkdown>{formDetails.description || ""}</ReactMarkdown></div></div>
              </div>
            </div>
          </div>

          {/* Upload recipe image */}
          <div className="flex w-full flex-col gap-5 items-center justify-center rounded-2xl border border-[#e8e1d7] bg-[#f8f3eb] p-8 md:w-1/3">
            <label
              htmlFor="image"
              className="font-bold cursor-pointer flex flex-col justify-center items-center"
            >
              <div
                className={formDetails.image ? "w-[65%] mb-2" : "w-[30%] mb-6"}
              >
                {progress > 0 && progress < 100 ? (
                  <LinearProgress
                    aria-label="Image upload progress"
                    variant="determinate"
                    value={progress}
                    color="warning"
                  />
                ) : (
                  <img
                    src={formDetails.image || photo}
                    alt="upload photo"
                    className="w-full "
                  />
                )}
              </div>
              <p className="text-center">
                <span className="text-[#775421]">{formDetails.image ? "Change image (JPEG or PNG)" : "Choose a JPEG or PNG image (required)"}</span>
              </p>
            </label>
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/png"
              aria-describedby={uploadError || (formError && /image/i.test(formError)) ? "image-error" : undefined}
              className="sr-only"
              onChange={handleChange}
            />
          {(uploadError || (formError && /image/i.test(formError))) && <p id="image-error" role="alert" className="text-sm text-red-700">{uploadError || formError}</p>}
            <Button
              content={"Save changes"}
              type={"submit"}
              customCss="max-w-max rounded-xl !bg-[#29251f] !px-6 !py-3 !text-white !shadow-none hover:!bg-[#443b30]"
              loading={isLoading || (progress > 0 && progress < 100)}
            />
          </div>
        </form>
      )}
    </section>
  );
};

export default EditBlog;
