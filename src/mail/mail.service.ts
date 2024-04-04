import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { confirmedUserEmailDTO } from 'src/user/dto/confirmedusermail.dto';
import { confirmedVendorEmailDTO } from 'src/vendor/dto/confirmedVendorEmail.dto';
import { confirmedPlannerEmailDTO } from 'src/planner/dto/confirmedPlanner.dto';
import { verifyEmailDto } from './dto/verifty.email.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { Vendor } from 'src/vendor/schema/vendor.schema';
import { Planner } from 'src/planner/schema/planner.schema';
import { transporter } from 'src/common/nodemailer/email.nodemailer';
import { sendOtp } from 'src/common/otp/otp.token';
import { returnString } from 'src/common/return/return.input';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
    @InjectModel(Planner.name) private plannerModel: Model<Planner>,
  ) {
    transporter;
  }

  //send user email confirmation
  async sendUserConfirmation(user: User): Promise<returnString> {
    const { email } = user;
    const { token, tokenExpirationTime } = sendOtp;

    const sendmail = {
      from: 'info@paateeng.com',
      to: email,
      subject: 'confirmed your email',
      text: `Click the following link to confirm your registration: https://yourwebsite.com/reset-password?token=${token}`,
    };

    try {
      await transporter.sendMail(sendmail);
      await this.userModel.findOneAndUpdate(
        { email: email },
        {
          emailConfirmedToken: token,
          emailTokenExpiration: tokenExpirationTime,
        },
        { new: true },
      );
      return {
        Response: `verification code sent to ${email}, kindly confirm your email`,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //send email token for Vendor
  async sendVendorConfirmation(vendor: Vendor): Promise<returnString> {
    const { email, emailConfirmedToken } = vendor;
    const { token, tokenExpirationTime } = sendOtp;

    // const savedVendor = await vendor.save()

    const sendmail = {
      from: 'info@paateeng.com',
      to: email,
      subject: 'confirmed your email',
      text: `Click the following link to confirm your registration: https://yourwebsite.com/reset-password?token=${token}`,
    };
    try {
      await transporter.sendMail(sendmail);
      await this.vendorModel.findOneAndUpdate(
        { email: email },
        {
          emailConfirmedToken: token,
          emailTokenExpiration: tokenExpirationTime,
        },
        { new: true },
      );
      return {
        Response: `verification code sent to ${email}, kindly confirm your email`,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //send email token for Planner
  async sendPlannerConfirmation(planner: Planner): Promise<returnString> {
    const { email, emailConfirmedToken } = planner;
    const { token, tokenExpirationTime } = sendOtp;

    const sendmail = {
      from: 'info@paateeng.com',
      to: email,
      subject: 'confirmed your email',
      text: `Click the following link to confirm your registration: https://yourwebsite.com/reset-password?token=${token}`,
    };
    try {
      await transporter.sendMail(sendmail);
      await this.plannerModel.findOneAndUpdate(
        { email: email },
        {
          emailConfirmedToken: token,
          emailTokenExpiration: tokenExpirationTime,
        },
        { new: true },
      );
      return {
        Response: `verification code sent to ${email}, kindly confirm your email`,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //confirmed user email
  async confirmedUserEmail(
    input: confirmedUserEmailDTO,
  ): Promise<returnString> {
    const { email, confirmedToken } = input;
    try {
      const user = await this.userModel.findOne({
        email: email,
      });
      if (!user) {
        throw new HttpException(
          'please check your email address',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      if (
        user.emailConfirmedToken !== confirmedToken ||
        user.emailTokenExpiration < new Date()
      ) {
        throw new UnprocessableEntityException(
          'Your code is not valid or has expired',
        );
      }
      user.emailConfirmed = true;
      user.emailConfirmedToken = null;
      user.emailTokenExpiration = null;
      await user.save();

      return {
        Response: `your email ${email} is now verified`,
      };
    } catch (error) {
      throw new InternalServerErrorException('server error');
    }
  }

  //confirmed vendor email
  async confirmedVendorEmail(
    input: confirmedVendorEmailDTO,
  ): Promise<returnString> {
    try {
      const vendor = await this.vendorModel.findOne({
        email: input.email,
      });
      if (!vendor) {
        throw new HttpException(
          'please check your email address',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      if (
        vendor.emailConfirmedToken !== input.confirmedToken ||
        vendor.emailTokenExpiration < new Date()
      ) {
        throw new HttpException(
          'wrong credential or token has expired',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      vendor.emailConfirmed = true;
      vendor.emailConfirmedToken = null;
      vendor.emailTokenExpiration = null;

      const savedvendor = await vendor.save();

      return {
        Response: `your email address ${savedvendor.email} is now verified`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('server error');
    }
  }

  async confirmedPlannerEmail(
    input: confirmedPlannerEmailDTO,
  ): Promise<returnString> {
    try {
      const planner = await this.plannerModel.findOne({ email: input.email });

      if (!planner) {
        throw new HttpException(
          'please check your email address',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      if (
        planner.emailConfirmedToken !== input.confirmedToken ||
        planner.emailTokenExpiration < new Date()
      ) {
        throw new HttpException(
          'wrong credential or token has expired',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      planner.emailConfirmed = true;
      planner.emailConfirmedToken = null;
      planner.emailTokenExpiration = null;

      const savedPlanner = await planner.save();

      return {
        Response: `your email address ${savedPlanner.email} has been verified`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('server error');
    }
  }

  async verifyemail(input: verifyEmailDto) {
    const user = await this.userModel.findOne({ email: input.email });

    const vendor = await this.vendorModel.findOne({ email: input.email });

    const planner = await this.plannerModel.findOne({ email: input.email });

    if (user) {
      return await this.confirmedUserEmail(input);
    }
    if (vendor) {
      return await this.confirmedVendorEmail(input);
    }

    if (planner) {
      return await this.confirmedPlannerEmail(input);
    }
  }
}
