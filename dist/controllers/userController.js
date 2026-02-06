import userService from "../services/userService.js";
export const register = async (req, res) => {
    try {
        const data = req.body;
        if (!data.username || !data.email || !data.password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const result = await userService.registerUser(data);
        if (!result.ok) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(201).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const login = async (req, res) => {
    try {
        const data = req.body;
        if (!data.email || !data.password) {
            return res.status(400).json({ error: "Missing email or password" });
        }
        const result = await userService.loginUser(data);
        if (!result.ok) {
            return res.status(401).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const getProfile = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await userService.getUserProfile(userId);
        if (!result.ok) {
            return res.status(404).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export default { register, login, getProfile };
//# sourceMappingURL=userController.js.map