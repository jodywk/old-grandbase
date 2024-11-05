const Spinner = (props) => {
  return (
    <div className="flex justify-center items-center w-full h-full flex-col space-y-2">
      <div className="w-40 h-40 border-t-8 border-b-8 dark:border-white border-white rounded-full animate-spin"></div>
      <div className="text-white dark:text-white font-bold text-[24px]">
        {props.msg ?? 'Loading...'}
      </div>
    </div>
  );
};

export default Spinner;
