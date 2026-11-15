
const ComponentLoading = () => (
  <div role="status" className="flex min-h-[12rem] items-center justify-center gap-3 text-[#62584b]">
    <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-[#ded4c5] border-t-[#775421] motion-reduce:animate-none" />
    <span>Loading...</span>
  </div>
);
export default ComponentLoading;
