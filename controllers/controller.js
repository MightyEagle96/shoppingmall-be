import accountModel from "../models/accountModel.js";
import { createAccessToken, verifyAccessToken } from "./auth.js";
import { readFile } from "fs";
import bcrypt from "bcryptjs";
import XLSX from "xlsx";
import { institutions, states } from "../institutions.js";
import { mySecret } from "../app.js";

export const CreateAccount = async (req, res) => {
  try {
    //check if the email exists
    const existingEmail = await accountModel.findOne({ email: req.body.email });

    if (existingEmail)
      return res.status(400).send("Email address already exists");

    const user = await accountModel.create(req.body);

    const accessToken = createAccessToken(user);
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 60 * 1000),
      })
      .json(accessToken);
  } catch (error) {
    res.status(500).send(new Error(error).message);
  }
};

export const LoginAccount = async (req, res) => {
  try {
    //check the email
    const user = await accountModel.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("No email address found");

    //check the password
    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) return res.status(400).send("Password don't match");

    user.password = undefined;
    const accessToken = createAccessToken(user);
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 60 * 1000),
      })
      .json(accessToken);
  } catch (error) {
    res.status(500).send(new Error(error).message);
  }
};

export const IsLoggedIn = async (req, res, next) => {
  try {
    //verify the access token
    if (!req.cookies.accessToken)
      return res.status(401).send("Access token has expired");

    req.account = verifyAccessToken(req.cookies.accessToken);
    next();
  } catch (error) {
    res.status(401).send(new Error(error).message);
  }
};

export const RestrictTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.account.role))
      return res
        .status(403)
        .send("You don't have permission to access this resource");
    next();
  };

// export const AttendanceSummary = (req, res) => {
//   try {
//     readFile("./2022File.json", "utf-8", (err, data) => {
//       if (err) throw err;

//       const result = [];

//       const items = JSON.parse(data);

//       for (let i = 0; i < items.length; i++) {
//         if (items[i].institution) {
//           const institution = institutions.find(
//             (c) => c.INID === Number(items[i].institution.code)
//           );

//           if (institution) {
//             const state = states.find((c) => c.ST_ID === institution.InSt);

//             if (state) {
//               result.push({
//                 Name: `${items[i].title || ""} ${items[i].firstName || ""} ${
//                   items[i].surname || ""
//                 }`,
//                 Role: items[i].role,
//                 "Email Address": items[i].email,
//                 "Phone Number": `+${items[i].phoneNumber}`,
//                 Institution: items[i].institution.name,
//                 Code: items[i].institution.code,
//                 State: state.ST_NAME,
//               });
//             }
//           }
//         }
//       }
//       const sorted = result.sort(
//         (a, b) =>
//           (a.State > b.State ? 1 : b.State > a.State ? -1 : 0) ||
//           (a.Institution > b.Institution
//             ? 1
//             : b.Institution > a.Institution
//             ? -1
//             : 0) ||
//           (a.Name > b.Name ? 1 : b.Name > a.Name ? -1 : 0)
//       );

//       res.status(200).json(sorted);

//       const converJsontoExcel = () => {
//         const workSheet = XLSX.utils.json_to_sheet(sorted);
//         const workBook = XLSX.utils.book_new();

//         XLSX.utils.book_append_sheet(workBook, workSheet, "Attendance 2022");

//         //geenerate buffer
//         XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

//         //binary string
//         XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

//         XLSX.writeFile(workBook, "attendance2022.xlsx");
//       };
//       converJsontoExcel();
//     });
//   } catch (error) {
//     res.status(500).send(new Error(error).message);
//   }
// };
