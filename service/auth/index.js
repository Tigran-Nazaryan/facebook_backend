import {registrationSchema, loginSchema} from "../../validations/auth/index.js";
import ApiError from "../../exceptions/apiError.js";
import bcrypt from "bcrypt";
import {UserDto} from "../../dtos/userDto.js";
import TokenService from "../token/index.js";
import {User} from "../../models/models.js";

class AuthService {
    async registration(email, password, firstName, lastName, birthday, gender) {
        const {error} = registrationSchema.validate({email, password, firstName, lastName, birthday, gender});
        if (error) {
            throw new Error(error.details[0].message);
        }

        const candidate = await User.findOne({
            where: {
                email: email,
            }
        });
        if (candidate) {
            throw ApiError.BadRequestError("User already exists");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({email, password: hashPassword, firstName, lastName, birthday, gender});
        return {message: "User registered successfully."};
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

        console.log("User found:", user.email);
        console.log("Password valid:", isPasswordValid);

        const accessToken = TokenService.generateAccessToken({id: userDto.id});

        console.log("Generated token:", accessToken);

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
}

export default new AuthService();
