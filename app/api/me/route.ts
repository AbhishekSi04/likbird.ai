import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("app_session="))
    ?.split("=")[1];
  if (!token) return new Response("Unauthorized", { status: 401 });
  const session = verifySession(token);
  if (!session) return new Response("Unauthorized", { status: 401 });
  
  // Fetch full user details from database
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });
  
  if (!user) return new Response("User not found", { status: 404 });
  
  return Response.json(user);
}


