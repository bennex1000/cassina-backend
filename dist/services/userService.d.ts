import { UserProfile, RegisterRequest, LoginRequest, LoginResponse, Result } from "../types.js";
/**
 * Register a new user
 * Note: In production, password should be hashed with bcrypt
 */
export declare const registerUser: (data: RegisterRequest) => Promise<Result<UserProfile>>;
/**
 * Login user
 * Note: In production, should verify password with bcrypt.compare()
 */
export declare const loginUser: (data: LoginRequest) => Promise<Result<LoginResponse>>;
/**
 * Get user profile by ID
 */
export declare const getUserProfile: (userId: number) => Promise<Result<UserProfile>>;
declare const _default: {
    registerUser: (data: RegisterRequest) => Promise<Result<UserProfile>>;
    loginUser: (data: LoginRequest) => Promise<Result<LoginResponse>>;
    getUserProfile: (userId: number) => Promise<Result<UserProfile>>;
};
export default _default;
//# sourceMappingURL=userService.d.ts.map