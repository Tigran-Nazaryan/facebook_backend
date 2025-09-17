import {loginSchema, registrationSchema} from "../../validations/auth/index.js";
import ApiError from "../../exceptions/apiError.js";
import bcrypt from "bcrypt";
import {UserDto} from "../../dtos/userDto.js";
import TokenService from "../token/index.js";
import {User} from "../../models/models.js";
import jwt from "jsonwebtoken";
import MailService from "../mail/index.js";
import dotenv from "dotenv";
dotenv.config();

class AuthService {
    async registration(email, password, firstName, lastName, birthday, gender) {
        const { error } = registrationSchema.validate({ email, password, firstName, lastName, birthday, gender });
        if (error) throw new Error(error.details[0].message);

        const candidate = await User.findOne({ where: { email } });
        if (candidate) throw ApiError.BadRequestError("User already exists");

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashPassword,
            firstName,
            lastName,
            birthday,
            gender,
            isVerified: false
        });
        const userDto = new UserDto(newUser);

        const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
        const verifyLink = `${process.env.BASE_URL}/verify?token=${token}`;

        await MailService.sendActivationMail(email, verifyLink);
        const accessToken = TokenService.generateAccessToken({id: newUser.id});


        return {accessToken, user: userDto};
    }

    async login(email, password) {
        const {error} = loginSchema.validate({email, password});
        if (error) {
            throw new Error(error.details[0].message);
        }
        const user = await User.findOne({
            where: {
                email: email,
            }
        });
        if (!user) {
            throw ApiError.BadRequestError("User with this email was not found.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw ApiError.BadRequestError("Incorrect password.");
        }

        const userDto = new UserDto(user);

        const accessToken = TokenService.generateAccessToken({id: userDto.id});

        return {accessToken, user: userDto};
    }

    async verify(userId) {
        const user = await User.findByPk(userId, {
            attributes: ["id"],
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async verifyEmail(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            const user = await User.findOne({where: {email: decoded.email}});
            if (!user) {
                throw new Error("User not found");
            }

            user.isVerified = true;
            await user.save();
            const accessToken = TokenService.generateAccessToken({id: user.id});

            return {accessToken, user};
        } catch (e) {
            throw new Error("Invalid or expired token");
        }
    }

    async sendForgotPasswordMail (email, token) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("User not found");

        const expiration = new Date(Date.now() + 1000 * 60 * 30);
        user.resetToken = token;
        user.resetTokenExp = expiration;
        await user.save();

        const resetLink = `${process.env.BASE_URL}/forgot-password?token=${token}`;
        await MailService.sendForgotPasswordMail(user.email, resetLink);
    };

    async resetPasswordService (token, newPassword) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            const email = decoded.email;

            const user = await User.findOne({where: {email} });
            if (!user) {
                throw new Error("User not found");
            }

            if (user.resetToken !== token || !user.resetTokenExp || user.resetTokenExp < new Date()) {
                throw new Error("Invalid or expired token");
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            return { message: "Password successfully updated" };
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

export default new AuthService();
