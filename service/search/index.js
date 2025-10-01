import {Op} from "sequelize";
import {User} from "../../models/models.js";

class SearchService {
    async search(query = "", page = 1, limit = 10,  excludeUserId = null) {
        let where = {};

        if (query && query.trim() !== "") {
            const terms = query.trim().split(/\s+/);

            if (terms.length === 1) {
                where = {
                    [Op.or]: [
                        { firstName: { [Op.iLike]: `%${terms[0]}%` } },
                        { lastName: { [Op.iLike]: `%${terms[0]}%` } },
                    ],
                };
            } else if (terms.length >= 2) {
                where = {
                    [Op.and]: [
                        { firstName: { [Op.iLike]: `%${terms[0]}%` } },
                        { lastName: { [Op.iLike]: `%${terms[1]}%` } },
                    ],
                };
            }
        }

        if (excludeUserId) {
            where = { [Op.and]: [{ id: { [Op.ne]: excludeUserId } }, where] };
        }

        const totalCount = await User.count({ where });



        const users = await User.findAll({
            where,
            attributes: ["id", "firstName", "lastName", "coverPhoto"],
            limit,
            offset: (page - 1) * limit,
            order: [["id", "ASC"]],
        });

        return {users, totalCount};
    }
}

export default new SearchService();