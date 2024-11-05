import React from 'react'

const TelegramButton = (props) => {
    return (
        <a
            className="rounded-full border-[1px] p-2 bg-slate-600 border-zinc-500 group hover:bg-white bg-opacity-60 text-white hover:text-[#268FFE]"
            {...props}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 18 15"
                strokeWidth="1.5"
                fill="none"
                stroke="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M17.7631 2.0665L15.1576 13.7881C14.9608 14.6152 14.4484 14.8211 13.7201 14.4317L9.74977 11.6409L7.83432 13.3987C7.62218 13.601 7.44518 13.7699 7.03631 13.7699L7.32185 9.91306L14.6796 3.57075C14.9997 3.29896 14.6099 3.14777 14.1826 3.42015L5.08633 8.88415L1.17031 7.71464C0.318657 7.46108 0.30324 6.90221 1.34792 6.51218L16.6648 0.88287C17.374 0.629319 17.9944 1.03288 17.7631 2.0665Z"
                    fill="currentColor"
                />
            </svg>
        </a>
    );
};

export default TelegramButton