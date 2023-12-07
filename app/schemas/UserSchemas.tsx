import { z } from "zod";

const emailPattern = z.string().email().min(1, "Email address is required!");
const passwordMinimialPattern = z
  .string()
  .min(8, "Password has to contain at least 8 characters");
const passwordMinimialPatternLogin = z.string().min(1, "Password is required");
const usernamePattern = z.string().min(1, "Username is required!");

//TODO: fix copypasting of refines and super refines, maybe there is a fix for not working array of path strings...
export const PasswordChangeSchema = z
  .object({
    password: passwordMinimialPatternLogin,
    newPassword: passwordMinimialPattern,
    confirm: passwordMinimialPattern,
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: "Passwords don't match",
    path: ["password"], // path of error
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  })
  .superRefine(({ newPassword }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      // eslint-disable-next-line no-useless-escape
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < newPassword.length; i++) {
      const ch = newPassword.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        path: ["newPassword"],
        code: "custom",
        message: "Password does not meet complexity requirements",
      });

      return z.NEVER;
    }
  })
  .superRefine(({ confirm }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      // eslint-disable-next-line no-useless-escape
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < confirm.length; i++) {
      const ch = confirm.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        path: ["confirm"],
        code: "custom",
        message: "Password does not meet complexity requirements",
      });

      return z.NEVER;
    }
  });
export type PasswordChangeSchemaType = z.infer<typeof PasswordChangeSchema>;

export const EmailSchema = z.object({
  email: emailPattern,
});
export type EmailSchemaType = z.infer<typeof EmailSchema>;

export const UsernameSchema = z.object({
  username: usernamePattern,
});
export type UsernameSchemaType = z.infer<typeof UsernameSchema>;

export const RegisterSchema = z
  .object({
    email: emailPattern,
    username: usernamePattern,
    password: passwordMinimialPattern,
    confirm: passwordMinimialPattern,
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["password"], // path of error
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      // eslint-disable-next-line no-useless-escape
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        path: ["password"],
        code: "custom",
        message: "Password does not meet complexity requirements",
      });

      return z.NEVER;
    }
  })
  .superRefine(({ confirm }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      // eslint-disable-next-line no-useless-escape
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < confirm.length; i++) {
      const ch = confirm.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        path: ["confirm"],
        code: "custom",
        message: "Password does not meet complexity requirements",
      });

      return z.NEVER;
    }
  });
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: emailPattern,
  password: passwordMinimialPatternLogin,
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
