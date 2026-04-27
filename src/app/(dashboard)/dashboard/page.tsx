import { redirect } from "next/navigation";

export default async function Page() {
  // Logic check
  const userRole = "distributor"; // Replace with actual logic to get user role

  if (userRole === "distributor") {
    redirect("/dashboard/distributor");
  } else {
    redirect("/dashboard/vendor");
  }

  // Next.js needs this to consider the component valid
  return null;
}
