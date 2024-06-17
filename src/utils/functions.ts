import Qrcode from "qrcode";

export const generateQrcodeForUrl = async (url: string) => {
  const qrCodeImage = await Qrcode.toDataURL(url);
  return qrCodeImage;
};

export const generateQrCodeForJson = async (data: object) => {
  const dataString = JSON.stringify(data);

  const qrcode = Qrcode.toDataURL(dataString);
  return qrcode;
};

export const generateRandomSixDigitNumber = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateRandomNineDigitNumber = () => {
  return Math.floor(100000000 + Math.random() * 900000000);
};

export const getAbbreviation = (inputString: string): string => {
  // Convert the input string to uppercase
  const upperCaseString = inputString.toUpperCase();

  // Extract the initials
  const initials = upperCaseString
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");

  return initials;
};

export const isEmptyObject = (obj: object) => {
  return Object.keys(obj).length === 0;
};

export const convertArrayToString = (array: Array<any>) => {
  if (Array.isArray(array)) {
    if (array.length === 1) {
      return array[0];
    } else {
      return array.join(", ");
    }
  } else {
    return "Input is not an array.";
  }
};

export function showObjectProperties(obj: Record<string, any>): void {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      console.log(`Key: ${key}, Value: ${obj[key]}`);
    }
  }
}

export const sumArray = (values: number[]): number => {
  let sum = 0;
  for (const value of values) {
    sum += value;
  }
  return sum;
};
