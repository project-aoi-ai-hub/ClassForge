// ===========================================
// Stripe Webhook ハンドラー
// ===========================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { sendPurchaseEmail } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook設定が不正です" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook署名検証エラー:", error);
    return NextResponse.json({ error: "署名検証に失敗しました" }, { status: 400 });
  }

  // checkout.session.completed イベントを処理
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;

    if (courseId && userId) {
      try {
        // 購入記録を作成
        await prisma.purchase.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total || 0,
            status: "PAID",
          },
          create: {
            userId,
            courseId,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total || 0,
            status: "PAID",
          },
        });

        // 購入完了メール送信
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const course = await prisma.course.findUnique({ where: { id: courseId } });

        if (user?.email && course) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          await sendPurchaseEmail({
            to: user.email,
            courseName: course.title,
            courseUrl: `${appUrl}/learn/${course.slug}`,
          });
        }
      } catch (error) {
        console.error("購入記録作成エラー:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
