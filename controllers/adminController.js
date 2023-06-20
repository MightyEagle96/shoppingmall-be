import otp from "otp-generator";
import vendorModel from "../models/vendorModel.js";

export const CreateVendor = async (req, res) => {
  try {
    const organisationId = await otpChecker();

    res.send({ organisationId });
  } catch (error) {
    res.send(505).send(new Error(error).message);
  }
};

async function otpChecker() {
  const newOtp = otp.generate(6, {
    upperCaseAlphabets: true,
    specialChars: false,
  });

  const existing = await vendorModel.findOne({ organisationId: newOtp });

  if (existing) {
    otpChecker();
  } else return newOtp;
}
