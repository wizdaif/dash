import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function base64ToFile(
  base64data: string,
  fileName: string,
  fileType: string
): File {
  const base64 = base64data.split(",")[1] || base64data;

  const byteString = atob(base64);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new File([byteArray], fileName, {
    type: fileType,
  });
}

export function deepCompare(obj1: any, obj2: any) {
  if (typeof obj2 !== "object" || obj2 === null) {
    return obj1 !== obj2 ? obj2 : undefined;
  }

  if (Array.isArray(obj2)) {
    const diffArray: any[] = [];
    obj2.forEach((item, index) => {
      const diff = deepCompare(obj1?.[index], item);
      if (diff !== undefined) diffArray[index] = diff;
    });
    return diffArray.length ? diffArray : undefined;
  }

  const diffObj: any = {};
  Object.keys(obj2).forEach((prop) => {
    const diff = deepCompare(obj1?.[prop], obj2[prop]);
    if (diff !== undefined) {
      diffObj[prop] = diff;
    }
  });

  return Object.keys(diffObj).length ? diffObj : undefined;
}
