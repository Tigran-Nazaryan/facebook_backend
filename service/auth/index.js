import {registrationSchema} from "../../validations/registration.js";
import ApiError from "../../exceptions/apiError.js";
import bcrypt from "bcrypt";
import {UserDto} from "../../dtos/userDto.js";
import TokenService from "../token/index.js";
import {User} from "../../models/models.js";
import {loginSchema} from "../../validations/login.js";

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
        const user = await User.create({email, password: hashPassword, firstName, lastName, birthday, gender});
        const userDto = new UserDto(user);

        return {user: userDto};
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

        const tokens = TokenService.generateAccessToken({id: userDto.id});

        return {tokens, user: userDto};
    }

    async logout(req) {
        return true;
    }
}

export default new AuthService();
