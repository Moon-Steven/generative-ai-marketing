import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const user = await getSession(request);

  if (!user) return errorResponse("Unauthorized", 401);

  return jsonResponse({
    id: user.id,
    email: user.email,
    name: user.name,
    planTier: user.planTier,
  });
}
