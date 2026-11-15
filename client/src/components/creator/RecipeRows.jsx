import P from "prop-types";

const RecipeRows = ({ values, field, setValues }) => {
  const label = field === "ingredients" ? "ingredient" : "step";
  const update = (index, value) => setValues((current) => ({ ...current, [field]: current[field].map((item, i) => i === index ? value : item) }));
  const move = (index, offset) => setValues((current) => {
    const rows = [...current[field]];
    const other = index + offset;
    [rows[index], rows[other]] = [rows[other], rows[index]];
    return { ...current, [field]: rows };
  });
  const remove = (index) => setValues((current) => ({ ...current, [field]: current[field].filter((_, i) => i !== index) }));
  return <ul className="flex flex-col gap-3">{values.map((value, index) => <li key={index} className="rounded-lg border border-[#e8e1d7] p-3">
    <label className="block text-sm font-semibold" htmlFor={`${field}-${index}`}>{label === "step" ? "Step" : "Ingredient"} {index + 1}</label>
    {label === "step" ? <textarea maxLength={5000} id={`${field}-${index}`} value={value} onChange={(event) => update(index, event.target.value)} rows={3} className="mt-2 w-full rounded border p-2" /> : <input maxLength={500} id={`${field}-${index}`} value={value} onChange={(event) => update(index, event.target.value)} className="mt-2 w-full rounded border p-2" />}
    <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold">
      <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${label} ${index + 1} up`} className="underline disabled:opacity-40">Move up</button>
      <button type="button" disabled={index === values.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${label} ${index + 1} down`} className="underline disabled:opacity-40">Move down</button>
      <button type="button" onClick={() => remove(index)} aria-label={`Remove ${label} ${index + 1}`} className="text-red-700 underline">Remove</button>
    </div>
  </li>)}</ul>;
};
RecipeRows.propTypes = { values: P.arrayOf(P.string).isRequired, field: P.string.isRequired, setValues: P.func.isRequired };

export default RecipeRows;
