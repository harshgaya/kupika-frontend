import {cookies} from "next/headers";import {signToken,verifyToken} from "@/src/lib/signed-token";
const COOKIE='kp_admin_session',MAX_AGE=60*60*12,secret=process.env.ADMIN_JWT_SECRET||process.env.JWT_SECRET;
export async function createAdminSession(username){(await cookies()).set(COOKIE,signToken({admin:true,username},secret,MAX_AGE),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:MAX_AGE})}
export async function isAdmin(){try{return verifyToken((await cookies()).get(COOKIE)?.value,secret)?.admin===true}catch{return false}}
export async function clearAdminSession(){(await cookies()).delete(COOKIE)}
