// ===========================================
// Stripe クライアント設定
// ===========================================
// テストモード前提。本番切替はENVで対応
// ビルド時にAPIキーが未設定でも動作するよう遅延初期化

import Stripe from "stripe";

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY が設定されていません");
  }
  return new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
}

// 遅延初期化（実際にAPIを呼ぶ時だけインスタンスを作成）
let _stripe: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!_stripe) {
      _stripe = getStripeClient();
    }
    return Reflect.get(_stripe, prop);
  },
});

/**
 * Stripe Checkoutセッションを作成する
 * @param courseId - 講座ID
 * @param courseTitle - 講座タイトル
 * @param price - 価格（円）
 * @param userId - ユーザーID
 * @returns Stripe Checkoutセッション
 */
export async function createCheckoutSession({
  courseId,
  courseTitle,
  price,
  userId,
}: {
  courseId: string;
  courseTitle: string;
  price: number;
  userId: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: courseTitle,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${appUrl}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/courses`,
    metadata: {
      courseId,
      userId,
    },
  });

  return session;
}
