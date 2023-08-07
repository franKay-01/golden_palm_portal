import CryptoJS from "crypto-js";

const useEncryption = () => {

  const encryptText = (text) => {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(text),
      "XkhZG4fW2t2W"
    ).toString();

    return data
  }

  const decryptText = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, "XkhZG4fW2t2W");
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data
  }

  return {encryptText, decryptText}
}

export default useEncryption;