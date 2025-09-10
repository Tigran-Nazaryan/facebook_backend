import { registrationSchema } from "../../validations/registration";
import ApiError from "../../exceptions/apiError";
import bcrypt from "bcrypt";
import { UserDto } from "../../dtos/userDto";
import TokenService from "../token";
import {User} from "../../../models/models";

class AuthService {
    async registration(email, password, firstName, lastName ) {
        const { error } = registrationSchema.validate({ email, password, firstName, lastName });
        if (error) {
            throw new Error(error.details[0].message);
        }

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw ApiError.BadRequestError("User already exists");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashPassword, firstName, lastName });
        const userDto = new UserDto(user);

        const tokens = TokenService.generateAccessToken({ id: userDto.id });

        return { tokens, user: userDto };
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequestError("User with this email was not found.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw ApiError.BadRequestError("Incorrect password.");
        }

        const userDto = new UserDto(user);

        const tokens = TokenService.generateAccessToken({ id: userDto.id });

        return { tokens, user: userDto };
    }
    async logout(req) {
        return true;
    }
}

export default new AuthService();
