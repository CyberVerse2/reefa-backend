import axios from "axios";

// import { decryptData } from '../globals/utils/encryptData.utils ';
import { findUser } from "../user/user.services";
import AppError from "src/common/utils/appError";

async function getCheckoutLink(body: any) {
  const data = JSON.stringify(body);
  console.log(process.env.BLOC_PUBLIC_KEY);
  console.log(body);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.blochq.io/v1/checkout/new",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BLOC_PUBLIC_KEY}`,
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response);
    const checkoutLink = response.data?.data;
    if (!checkoutLink) throw new AppError("Failed to create checkout link");
    return checkoutLink;
  } catch (error) {
    throw new AppError(error as string);
  }
}

export { getCheckoutLink };
