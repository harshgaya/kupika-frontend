import {cookies} from "next/headers";import {signToken,verifyToken} from "@/src/lib/signed-token";
const SECRET=process.env.JWT_SECRET,COOKIE='kp_session',MAX_AGE=60*60*24*30;if(!SECRET)throw new Error('Missing JWT_SECRET. Add it to .env.local.');
export async function createSession(userId){(await cookies()).set(COOKIE,signToken({uid:String(userId)},SECRET,MAX_AGE),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:MAX_AGE})}
export async function getSessionUserId(){try{return verifyToken((await cookies()).get(COOKIE)?.value,SECRET)?.uid||null}catch{return null}}
export async function clearSession(){(await cookies()).delete(COOKIE)}
