import { Router } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../schemas";
import { generateToken } from "../services/token.service";
import { IUser } from "../types/user";
import { ENV } from "../configs/config";
const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  const {
    email,
    username,
    password,
  }: { email: string; username: string; password: string } =
    req.validatedData?.body || {};

  try {
    const exist = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (exist)
      return res.easyResponse({
        statusCode: 409,
        message: "username or email already exists",
      });

    /* we can check if the user exist or not - if not it will create a user in one go */
    // const user = await UserModel.findOneAndUpdate(
    //   { $or: [{ username }, { email }] }, // Search for user by username or email
    //   { $setOnInsert: { username, email, password: hashedPassword } }, // Only set if inserting
    //   { upsert: true, new: true, runValidators: true } // Insert if not found, return the document
    // );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // we would use JWT ID in future to whitelist the user account
    const { /* JTI, */ refreshToken, accessToken } = generateToken(
      user._id.toString()
    );

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
    });

    return res.easyResponse({
      statusCode: 201,
      message: "User successfully created",
      payload: {
        user: user.toJSON(),
        accessToken,
      },
    });
  } catch (err) {
    return res.easyResponse({
      statusCode: 500,
      message: "Unable to create account at this time",
      error: err as Error,
    });
  }
});

export default router;
