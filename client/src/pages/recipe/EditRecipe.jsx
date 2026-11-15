import RecipeRows from "../../components/creator/RecipeRows";
import useCreatorDraft from "../../hooks/useCreatorDraft";
import useTitle from "../../hooks/useTitle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../../components/button/Button";
import ComponentLoading from "../../components/loading/ComponentLoading";
import { photo } from "../../assets";
import uploadImage from "../../common/uploadImage";
import { LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import {
  useGetRecipeQuery,
  useUpdateRecipeMutation,
} from "../../features/recipe/recipeApiSlice";
import { Link, useParams } from "react-router-dom";

const EditRecipe = () => {
  useTitle("Recipen - Edit recipe");
  const { id } = useParams();
  const initializedId = useRef(null);

  const { data, ...rest } = useGetRecipeQuery(id);
  const [updateRecipe, { isLoading }] = useUpdateRecipeMutation();

  const [formDetails, setFormDetails] = useState({
    title: data?.title || "",
    image: data?.image || "",
    description: data?.description || "",
    calories: data?.calories || "",
    cookingTime: data?.cookingTime || "",
    ingredients: data?.ingredients || [],
    instructions: data?.instructions || [],
  });

  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [instruction, setInstruction] = useState("");
  const [focused, setFocused] = useState({
    title: "",
    calories: "",
    cookingTime: "",
    ingredient: "",
  });

  useEffect(() => {
    if (data && data._id === id && initializedId.current !== id) {
      initializedId.current = id;
      setFormDetails({
        title: data?.title,
        image: data?.image,
        description: data?.description,
        calories: data?.calories,
        cookingTime: data?.cookingTime,
        ingredients: data?.ingredients,
        instructions: data?.instructions,
      });
    }
  }, [data, id]);

  const draftValues = useMemo(() => ({ ...formDetails, draftIngredient: ingredient, draftInstruction: instruction }), [formDetails, ingredient, instruction]);
  const restoreDraft = useCallback((draft) => {
    const { draftIngredient = "", draftInstruction = "", ...details } = draft;
    setIngredient(draftIngredient);
    setInstruction(draftInstruction);
    setFormDetails(details);
  }, []);
  const { status: draftStatus, markSaved, dirty: hasDraft, discardDraft } = useCreatorDraft(`recipe:edit:${id}`, draftValues, restoreDraft, Boolean(data && initializedId.current === id));

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

  const addIngredient = () => {
    if (formDetails.ingredients.length >= 100) return toast.error("A recipe can have at most 100 ingredients.");
    if (!ingredient.trim()) {
      return toast.error("Ingredient cannot be empty");
    }
    setFormDetails((current) => ({
      ...current,
      ingredients: [...current.ingredients, ingredient.trim()],
    }));
    setIngredient("");
  };

  const addInstruction = () => {
    if (formDetails.instructions.length >= 100) return toast.error("A recipe can have at most 100 steps.");
    if (!instruction.trim()) {
      return toast.error("Instruction cannot be empty");
    }
    setFormDetails((current) => ({
      ...current,
      instructions: [...current.instructions, instruction.trim()],
    }));
    setInstruction("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (progress > 0 && progress < 100) return toast.info("Wait for the image upload to finish.");

    if (ingredient.trim() || instruction.trim()) {
      setFormError("Add or clear the ingredient or step you are writing before saving.");
      document.getElementById(ingredient.trim() ? "ingredient" : "instruction")?.focus();
      return;
    }
    const invalidField = !formDetails.ingredients.length || formDetails.ingredients.some((item) => !item.trim()) ? "ingredient" : !formDetails.instructions.length || formDetails.instructions.some((item) => !item.trim()) ? "instruction" : !formDetails.image ? "image" : "";
    if (invalidField) {
      setFormError(invalidField === "image" ? "Choose a recipe image." : invalidField === "ingredient" ? "Add at least one ingredient and fill in each ingredient." : "Add at least one step and fill in each step.");
      document.getElementById(invalidField)?.focus();
      return;
    }
    setFormError("");

    try {
      await toast.promise(
        updateRecipe({ ...formDetails, recipeId: id }).unwrap(),
        {
          pending: "Please wait...",
          success: "Recipe updated successfully",
          error: { render: ({ data: error }) => error?.data?.message || "Unable to update recipe" },
        }
      );
      markSaved(draftValues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="creator-editor box max-w-6xl pt-6 md:pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Your kitchen</p><h1 className="mt-3 font-serif text-4xl">Edit recipe</h1><p className="mt-2 text-[#6b6257]">Update the details of your recipe.</p>
      {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
      {draftStatus && <p role="status" className="mt-3 text-sm text-[#6b6257]">{draftStatus}</p>}
      {hasDraft && <button type="button" onClick={discardDraft} className="mt-2 text-sm font-semibold underline">Discard unsaved changes</button>}
      <hr />
      {rest.isLoading ? (
        <ComponentLoading />
      ) : rest.isError || !data ? (
        <div className="mt-8 rounded-xl bg-[#f8f3eb] p-6" role="alert"><p>{rest.error?.status === 404 ? "This recipe could not be found." : "Could not load this recipe. Please try again."}</p>{rest.error?.status !== 404 && <button type="button" className="mt-3 mr-4 underline" onClick={rest.refetch}>Try again</button>}<Link to="/recipe/my-recipes" className="mt-3 inline-block underline">Back to my recipes</Link></div>
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
                Recipe name
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
                  pattern={"^.{3,}$"}
                  required
                  aria-required="true"
                  aria-describedby="title-error"
                  placeholder="Enter recipe name"
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
                />
                <span
                  id="title-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Name should at least 3 characters long
                </span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="description"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Recipe description
              </label>
              <div className="flex flex-col basis-1/2">
                <textarea
                  type="text"
                  onChange={handleChange}
                  value={formDetails.description}
                  id="description"
                maxLength={5000}
                  required
                  name="description"
                  rows="5"
                  aria-required="true"
                  placeholder="Enter your description here..."
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
                ></textarea>
              </div>
            </div>
            <hr />
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="calories"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Total calories
              </label>
              <div className="flex flex-col basis-1/2">
                <input
                  type="number"
                  onChange={handleChange}
                  value={formDetails.calories}
                  id="calories"
                  min="0"
                  step="any"
                  required
                  name="calories"
                  onBlur={handleFocus}
                  data-focused={focused.calories.toString()}
                  aria-required="true"
                  aria-describedby="calories-error"
                  placeholder="Enter total calories"
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
                />
                <span
                  id="calories-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Enter a non-negative number
                </span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="cookingTime"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Cooking time
              </label>
              <div className="flex flex-col basis-1/2">
                <input
                  type="number"
                  onChange={handleChange}
                  value={formDetails.cookingTime}
                  id="cookingTime"
                  min="0.01"
                  step="any"
                  required
                  name="cookingTime"
                  onBlur={handleFocus}
                  data-focused={focused.cookingTime.toString()}
                  aria-required="true"
                  aria-describedby="cookingTime-error"
                  placeholder="Total cooking time in mins."
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary"
                />
                <span
                  id="cookingTime-error"
                  className="hidden text-red-500 pl-2 text-sm mt-1"
                >
                  Must only include numbers
                </span>
              </div>
            </div>
            <hr />
            <div className="flex flex-col sm:flex-row justify-between">
              <label
                htmlFor="ingredient"
                className="text-sm font-semibold mb-3 basis-1/2"
              >
                Add ingredients
              </label>
              <div className="flex flex-col basis-1/2">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 justify-between">
                    <input
                      type="text"
                      onChange={(e) => setIngredient(e.target.value)}
                      value={ingredient}
                      id="ingredient"
                    maxLength={500}
                      name="ingredient"
                      onBlur={handleFocus}
                      data-focused={focused.ingredient.toString()}
                      aria-describedby={formError && /ingredient/i.test(formError) ? "ingredient-error" : undefined}
                      placeholder="2 medium onion"
                      className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full"
                    />
                    <Button
                      content={"Add"}
                      customCss="rounded-lg border border-[#cfc6ba] !bg-white !px-4 !py-2 text-sm !text-[#29251f] !shadow-none hover:!bg-[#f8f3eb]"
                      handleClick={addIngredient}
                    />
                  </div>
                  {formError && /ingredient/i.test(formError) && <p id="ingredient-error" className="text-sm text-red-700">{formError}</p>}
                <RecipeRows values={formDetails.ingredients} field="ingredients" setValues={setFormDetails} />
                </div>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-4 justify-between">
              <div className="flex gap-1 justify-between items-center">
                <label
                  htmlFor="instruction"
                  className="text-sm font-semibold mb-3 basis-1/2"
                >
                  Add Steps
                </label>
                <Button
                  content={"Add"}
                  customCss="rounded-lg border border-[#cfc6ba] !bg-white !px-4 !py-2 text-sm !text-[#29251f] !shadow-none hover:!bg-[#f8f3eb]"
                  handleClick={addInstruction}
                />
              </div>
              <div className="flex flex-col basis-1/2 gap-2">
                <textarea
                  type="text"
                  onChange={(e) => setInstruction(e.target.value)}
                  value={instruction}
                  id="instruction"
                maxLength={5000}
                  name="instruction"
                  rows="7"
                  aria-describedby={formError && /step/i.test(formError) ? "instruction-error" : undefined}
                  placeholder="Write your steps here..."
                  className="p-1.5 border bg-gray-100 rounded focus:outline outline-primary w-full resize-none"
                ></textarea>
                {/* All added instructions */}
                {formError && /step/i.test(formError) && <p id="instruction-error" className="text-sm text-red-700">{formError}</p>}
              <RecipeRows values={formDetails.instructions} field="instructions" setValues={setFormDetails} />
              </div>
            </div>
          </div>

          {/* Upload recipe image */}
          <div className="flex w-full flex-col gap-5 items-center justify-center rounded-2xl border border-[#e8e1d7] bg-[#f8f3eb] p-8 md:w-1/3">
            <label
              htmlFor="image"
              className="font-bold cursor-pointer flex flex-col justify-center items-center w-full"
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

export default EditRecipe;
