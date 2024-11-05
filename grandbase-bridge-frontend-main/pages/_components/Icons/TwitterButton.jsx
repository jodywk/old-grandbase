import React from 'react';

const TwitterButton = (props) => {
  return (
    <a
      className="rounded-full border-[1px] p-2 bg-slate-600  hover:bg-white border-zinc-500 bg-opacity-60  text-white hover:text-cyan-600"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-brand-x"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    </a>
  );
};

export default TwitterButton