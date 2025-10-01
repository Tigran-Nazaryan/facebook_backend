import SearchService from "../../service/search/index.js";

export const users = async (req, res) => {
    try {
        const query = req.query.q || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const {users, totalCount} = await SearchService.search(query, page, limit);

        res.json({
            users,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({message: "Server error"});
    }
};
