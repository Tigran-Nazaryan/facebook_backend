import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    const saltRounds = 10;

    return await bcrypt.hash(password, saltRounds);
};

export const checkUserAccess = (reqUserId, paramId) => {
    if (reqUserId !== parseInt(paramId)) {
        const error = new Error('Forbidden');
        error.statusCode = 403;
        throw error;
    }
};

export const validateUser = (req, paramId) => {
    const userId = req.user?.id;
    if (!userId) throw { status: 401, message: 'Unauthorized' };
    if (!paramId || isNaN(parseInt(paramId))) throw { status: 400, message: 'Invalid ID' };
    return userId;
};
