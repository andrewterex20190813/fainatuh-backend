import AdminModel from "../models/Admin";
import PasswordService from "../services/PasswordService";
import ClientError from "../exeptions/ClientError";
import TryCatchErrorDecorator from "../decorators/TryCatchErrorDecorator";
import TokenService from "../services/TokenService";
import AppError from "../exeptions/AppError";
import MailService from "../services/MailService";
import randomize from "../utils/randomize";
import config from "../config/app";
import RecaptchaService from '../services/RecaptchaService';


class AdminAuthController {
  @TryCatchErrorDecorator
  static async signin(req, res) {
    const user = await AdminModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).json({"error": "Incorrect email or password"});
    }

    if (RecaptchaService.checkRecaptcha(req.body.token)) {
      const checkPassword = await PasswordService.checkPassword(
        req.body.password,
        user.password
      );

      if (!checkPassword) {
        return res.status(401).json({"error": "Incorrect email or password"});
      }

      const accessToken = await TokenService.createAccessToken(user);
      const refreshTokenHash = await TokenService.createRefreshToken(user);
      const refreshToken = await TokenService.addRefreshTokenUser(
        user,
        refreshTokenHash
      );

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type
        }
      });
    } else {
        return res.status(401).json({"error": "Recaptcha checking error"});
    }
  }

  @TryCatchErrorDecorator
  static async signup(req, res) {
    const isAlreadyUser = await AdminModel.findOne({ email: req.body.email });
    if (isAlreadyUser) {
        return res.status(401).json({"error": "This email is already registered"});
    }

    if (RecaptchaService.checkRecaptcha(req.body.token)) {
        const password = req.body.password;

        const user = new AdminModel({
            name: req.body.name,
            email: req.body.email,
            password: await PasswordService.hashPassword(password),
        });

        await user.save();

        //const token = await TokenService.createSetPasswordToken(user);

        /*
        MailService.sendWithTemplate(
            {
            to: req.body.email,
            subject: "Thanks for registering"
            },
            {
            template: "singup",
            data: {
                link: `${config.frontendHost}/setpassword/${user._id.toString()}/${token}`
            }
            }
        );
        */

        res.json({ status: "success" });
    } else {
        return res.status(401).json({"error": "Recaptcha checking error"});
    }
  }

  @TryCatchErrorDecorator
  static async forgotPassword(req, res, next) {
    const user = await AdminModel.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({"error": "User not found"});
    }

    const token = await TokenService.createRestorePasswordToken(user);
    
    MailService.sendWithTemplate(
      {
        to: user.email,
        subject: "Forgot password"
      },
      {
        template: "restorePassword",
        data: {
          host: config.frontendHost,
          id: user._id.toString(),
          token
        }
      }
    );

    res.json({ status: "success" });
  }

  @TryCatchErrorDecorator
  static async resetPassword(req, res, next) {

    res.json({ status: "success" });
  }



  @TryCatchErrorDecorator
  static async setPassword(req, res) {
    const user = await AdminModel.findOne({ _id: req.body.id });
    if (!user) {
      throw new ClientError("Token is invalid", 401);
    }

    const verifyData = await TokenService.verifyRestorePasswordToken(
      req.body.token,
      user.password,
    );

    if (!verifyData) {
      throw new ClientError("Token has expired or is invalid", 401);
    }

    const passwordHash = await PasswordService.hashPassword(req.body.password);
    user.password = passwordHash;
    user.email_verified = true;

    await user.save();

    res.json({ status: "success" });
  }

  @TryCatchErrorDecorator
  static async renewPasswordToken(req, res) {
    const user = await AdminModel.findOne({ _id: req.body.id });
    if (!user) {
      throw new ClientError("Invalid token", 401);
    }

    const verifyData = await TokenService.verifyRestorePasswordToken(
      req.body.token,
      user.password,
    );

    if (verifyData) {
      throw new ClientError("Your token is still valid", 406);
    }

    const token = await TokenService.createSetPasswordToken(user);

    MailService.sendWithTemplate(
      {
        to: user.email,
        subject: "Your New Token"
      },
      {
        template: "singup",
        data: {
          link: `${config.frontendHost}/setpassword/${user._id}/${token}`
        }
      }
    );
    res.json({ status: "success" });
  }

  @TryCatchErrorDecorator
  static async checkPasswordTokenValidity(req, res) {
    const user = await AdminModel.findOne({ _id: req.body.id });
    if (!user) {
      throw new ClientError("Invalid Token", 404);
    }
    else if (user.email_verified) {
      throw new ClientError("You have already set your password", 406);
    }

    const verifyData = await TokenService.verifyRestorePasswordToken(
      req.body.token,
      user.password,
    );

    if (!verifyData) {
      throw new ClientError("Token has expired", 401);
    }

    res.json({ status: "success" });
  }


  @TryCatchErrorDecorator
  static async refreshTokens(req, res) {
    const refreshTokenRequest = req.body.refreshToken;

    const verifyData = await TokenService.verifyRefreshToken(
      refreshTokenRequest
    );

    if (!verifyData) {
      throw new ClientError("Refresh token invalid or expired", 400);
    }

    const user = await AdminModel.findOne({ _id: verifyData.id });

    const isValid = await TokenService.checkRefreshTokenUser(
      user,
      refreshTokenRequest
    );

    if (!isValid) {
      throw new ClientError("Refresh token invalid or expired", 400);
    }

    await TokenService.removeRefreshTokenUser(user, refreshTokenRequest);

    const accessToken = await TokenService.createAccessToken(user);
    const refreshTokenHash = await TokenService.createRefreshToken(user);
    const refreshToken = await TokenService.addRefreshTokenUser(
      user,
      refreshTokenHash
    );

    res.json({ accessToken, refreshToken });
  }

  @TryCatchErrorDecorator
  static async logout(req, res, next) {
    const user = await AdminModel.findOne({ _id: req.userId });
    if (!user) {
      throw new AppError("UserId not found in request", 401);
    }

    user.refreshTokens = [];
    await user.save();

    res.json({ status: "success" });
  }

  @TryCatchErrorDecorator
  static async confirmRestorePassword(req, res, next) {
    const tokenRequest = req.body.token;
    const id = req.body.id;
    const user = await AdminModel.findOne({ _id: id });

    if (!user) {
      throw new ClientError("Refresh token invalid or expired", 400);
    }

    const verifyData = await TokenService.verifyRestorePasswordToken(
      tokenRequest,
      user.password,
    );

    if (!verifyData) {
      throw new ClientError("Refresh token invalid or expired", 400);
    }

    // const user = await AdminModel.findOne({ _id: verifyData.id });
    const password = req.body.password;

    user.password = await PasswordService.hashPassword(password);
    await user.save();

    res.json({ status: "success" });
  }

  @TryCatchErrorDecorator
  static async verifyRestorePasswordToken(req, res, next) {
    const tokenRequest = req.body.token;
    const id = req.body.id;
    const user = await AdminModel.findOne({ _id: id });

    if (!user) {
      throw new ClientError("Refresh token invalid or expired", 400);
    }

    const verifyData = await TokenService.verifyRestorePasswordToken(
      tokenRequest,
      user.password
    );

    if (!verifyData) {
      throw new ClientError("Refresh token invalid or expired", 400);
    }

    res.json({ status: "success" });
  }
}


export default AdminAuthController;
