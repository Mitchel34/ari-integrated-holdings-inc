import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.role !== "EXECUTIVE" && session.user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { email?: string; currentPassword?: string; newPassword?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const requestedEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (requestedEmail && (requestedEmail.length > 254 || !EMAIL_PATTERN.test(requestedEmail))) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const userId = session.user.id;

  // Fetch the current user record
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Verify current password before making any changes
  if (!body.currentPassword) {
    return NextResponse.json(
      { error: "Current password is required" },
      { status: 400 }
    );
  }

  // Only accept bcrypt-hashed passwords (security: no plaintext fallback)
  if (!user.password || (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$"))) {
    return NextResponse.json(
      { error: "Account password not properly configured" },
      { status: 500 }
    );
  }

  const isPasswordValid = await bcrypt.compare(body.currentPassword, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 401 }
    );
  }

  // Build update payload
  const updateData: { email?: string; password?: string } = {};

  if (requestedEmail && requestedEmail !== user.email) {
    // Check for duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: requestedEmail },
    });
    if (existing && existing.id !== userId) {
      return NextResponse.json(
        { error: "That email is already in use" },
        { status: 409 }
      );
    }
    updateData.email = requestedEmail;
  }

  if (body.newPassword) {
    if (body.newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }
    updateData.password = await bcrypt.hash(body.newPassword, 12);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ ok: true, message: "No changes made" });
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return NextResponse.json({
    ok: true,
    message: "Account updated successfully",
    emailChanged: !!updateData.email,
    passwordChanged: !!updateData.password,
  });
}
