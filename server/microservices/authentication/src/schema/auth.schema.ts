import { z } from 'zod';

const usernameSchema = z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "Username must start with a letter and contain only letters, numbers, and underscores"
    );

const passwordSchema = z.string()
    .min(4, "Password must be at least 4 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(
        /^[A-Za-z0-9 ]{4,100}$/,
        "Password can contain only letters, numbers, and spaces"
    );

const emailSchema = z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim();

const userTypeSchema = z.enum(['customer', 'farmer'], {
    errorMap: () => ({ message: "User type must be either 'customer' or 'farmer'" })
});

const verificationToken = z.string()
    .min(64, "Invalid verification token format")
    .max(64, "Invalid verification token format")

const UserRegistrationZodSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    userType: userTypeSchema,
    verificationEmailToken: verificationToken
}).passthrough(); // Allow additional fields to pass through to User Service


const LoginZodSchema = z.object({
    usernameOrEmail: z.string()
        .min(1, "Username or email is required")
        .trim(),
    password: z.string()
        .min(1, "Password is required")
});

//token is encrypted 64 string value
const EmailVerificationZodSchema = z.object({
    userID: z.union([
        z.string().min(1, "User ID is required"),
        z.number().int().positive("User ID must be a positive integer")
    ]).transform(val => String(val)),
    token: verificationToken
});

const ForgotPasswordZodSchema = z.object({
    email: emailSchema
});


export {
    UserRegistrationZodSchema,
    LoginZodSchema,
    EmailVerificationZodSchema,
    ForgotPasswordZodSchema,
}