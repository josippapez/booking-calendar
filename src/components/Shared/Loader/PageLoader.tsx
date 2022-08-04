import style from "./PageLoader.module.scss";

const PageLoader = () => {
  return (
    <div
      className={`dark:bg-neutral-700 w-full h-full flex justify-center items-center z-[999]`}
    >
      <div className={`${style.loader}`} />
    </div>
  );
};

export default PageLoader;
