import SearchService from "../../service/search/index.js";

export const users = async (req, res) => {
    try {
        const query = req.query.q || "";
        const users = await SearchService.search(query);

        res.json(users);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
