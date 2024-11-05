const CustomButton = (props) => {
    return (
      <button
        type="button"
        className={`w-full ${props.isDisabled ? "bg-[#ccc] text-black" : "bg-[#268FFE] text-white hover:bg-white hover:text-black"} text-base p-3 gap-3 rounded-xl`}
        disabled={props.isDisabled}
        {...props}
      >
        {props.title}
      </button>
    );
  };
  
  export default CustomButton;
  