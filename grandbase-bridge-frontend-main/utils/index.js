import { toast } from 'react-toastify'

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);


export const numberWithCommas = (x, digits = 3) => {
    // if (isEmpty(x)) return '0';
    return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export const shortenAddress = (address) => {
  return address.substring(0, 6) + "..." + address.substring(address.length - 6);
}

export const showToast = (flag, text) => {
  console.log(">>> showToast >>>", flag, text);
  let msgLen = text.length;
  text = text.substring(0, 100);
  if (msgLen > 100) text += "...";
  if (flag === 'e') {
    toast.error(text, {
      theme: "dark",
      position: "bottom-right",
      autoClose: 2000,
      pauseOnHover: false,
    })
  } else if (flag === 's') {
    toast.success(text, {
      theme: "dark",
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: false,
    })
  } else if (flag === 'w') {
    toast.warn(text, {
      theme: "dark",
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: false,
    })
  }
}