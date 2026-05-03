import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session2")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let userRole = "";

  try {
    // 1. Get the payload (second part of the JWT)
    const base64Url = sessionToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // 2. Decode the base64 string
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonPayload);

    userRole = payload.portal;
  } catch (error) {
    console.error("❌ Failed to decode token:", error);
    redirect("/login");
  }

  // 3. Handle Redirects
  if (userRole === "distributor") {
    redirect("/dashboard/distributor");
  } else if (userRole === "seller") {
    redirect("/dashboard/vendor");
  } else if (userRole === "superadmin") {
    redirect("/dashboard/admin");
  }

  return null;
}
