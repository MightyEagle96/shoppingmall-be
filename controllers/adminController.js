import otp from "otp-generator";
import vendorModel from "../models/vendorModel.js";

export const CreateVendor = async (req, res) => {
  try {
    req.body.organisationId = await otpChecker();

    //check if a vendor exists with this email address
    const existingAccount = await vendorModel.findOne({
      email: req.body.email,
    });

    if (existingAccount) {
      return res
        .status(400)
        .send("A vendor account alreay exists, with this email address");
    }

    await vendorModel.create(req.body);

    res.status(201).send("New vendor created");
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
