// // src/app/actions/auth.ts
// "use server";

// import { cookies } from "next/headers";

// export async function setAuthCookie(token: string, portal: string) {
//   const cookieStore = await cookies();

//   // Save the JWT token into a cookie named 'token'
//   // This is what your middleware looks for
//   cookieStore.set("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24, // 1 day
//     domain:
//       process.env.NODE_ENV === "production"
//         ? process.env.SESSION_COOKIE_DOMAIN
//         : undefined,
//   });

//   return { success: true };
// }
