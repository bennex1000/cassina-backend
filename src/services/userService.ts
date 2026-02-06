import { db } from "../database.js";
import {
    User,
    UserProfile,
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    Result,
} from "../types.js";

/**
 * Register a new user
 * Note: In production, password should be hashed with bcrypt
 */
export const registerUser = async (
    data: RegisterRequest
): Promise<Result<UserProfile>> => {
    try {
        // TODO: Hash password with bcrypt before storing
        const passwordHash = data.password; // TEMPORARY - should use bcrypt.hash()

        const { rows } = await db.query<User>(
            `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING user_id, username, email, level, experience, created_at, last_login
    `,
            [data.username, data.email, passwordHash]
        );

        const user = rows[0];
        if (!user) {
            return { ok: false, error: "Failed to create user" };
        }

        // Initialize user progression
        await db.query(
            `
      INSERT INTO user_progression (user_id, current_wheel_tier_id, daily_streak, reroll_points)
      VALUES ($1, 1, 0, 0)
    `,
            [user.user_id]
        );

        return { ok: true, data: user };
    } catch (error: any) {
        if (error.code === "23505") {
            // Unique constraint violation
            return { ok: false, error: "Username or email already exists" };
        }
        return { ok: false, error };
    }
};

/**
 * Login user
 * Note: In production, should verify password with bcrypt.compare()
 */
export const loginUser = async (
    data: LoginRequest
): Promise<Result<LoginResponse>> => {
    try {
        const { rows } = await db.query<User>(
            `
      SELECT * FROM users WHERE email = $1 OR username = $1
    `,
            [data.email]
        );

        if (rows.length === 0) {
            return { ok: false, error: "Invalid email or password" };
        }

        const user = rows[0];
        if (!user) {
            return { ok: false, error: "Invalid email or password" };
        }

        // TODO: Use bcrypt.compare() to verify password
        if (user.password_hash !== data.password) {
            return { ok: false, error: "Invalid email or password" };
        }

        // Update last login
        await db.query(
            `
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1
    `,
            [user.user_id]
        );

        // Remove password_hash from response
        const { password_hash, ...userProfile } = user;

        return {
            ok: true,
            data: {
                user: userProfile,
                // TODO: Generate JWT token
            },
        };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (
    userId: number
): Promise<Result<UserProfile>> => {
    try {
        const { rows } = await db.query<User>(
            `
      SELECT user_id, username, email, level, experience, created_at, last_login
      FROM users
      WHERE user_id = $1
    `,
            [userId]
        );

        if (rows.length === 0) {
            return { ok: false, error: "User not found" };
        }

        const user = rows[0];
        if (!user) {
            return { ok: false, error: "User not found" };
        }

        return { ok: true, data: user };
    } catch (error) {
        return { ok: false, error };
    }
};

export default {
    registerUser,
    loginUser,
    getUserProfile,
};
