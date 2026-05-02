// ===========================================
// メール送信ヘルパー（Resend）
// ===========================================
// 抽象化レイヤー。Resend未契約でもコード上は完成
// ビルド時にAPI Key未設定でもクラッシュしないよう遅延初期化

import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return _resend;
}

const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@classforge.jp";

/**
 * メール送信の基本関数
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // API Keyが未設定の場合はコンソールログで代替
  if (!process.env.RESEND_API_KEY) {
    console.log("========== メール送信（開発モード） ==========");
    console.log(`宛先: ${to}`);
    console.log(`件名: ${subject}`);
    console.log(`本文: ${html}`);
    console.log("===============================================");
    return { id: "dev-mode", error: null };
  }

  try {
    const data = await getResend().emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { id: data.data?.id, error: null };
  } catch (error) {
    console.error("メール送信エラー:", error);
    return { id: null, error };
  }
}

/**
 * 購入完了メール
 */
export async function sendPurchaseEmail({
  to,
  courseName,
  courseUrl,
}: {
  to: string;
  courseName: string;
  courseUrl: string;
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "ClassForge";
  return sendEmail({
    to,
    subject: `【${appName}】「${courseName}」の購入が完了しました`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>購入ありがとうございます！</h2>
        <p>「${courseName}」の購入が完了しました。</p>
        <p>以下のリンクから講座を受講できます：</p>
        <a href="${courseUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          講座を受講する
        </a>
        <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
          ${appName}
        </p>
      </div>
    `,
  });
}

/**
 * パスワードリセットメール
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "ClassForge";
  return sendEmail({
    to,
    subject: `【${appName}】パスワードリセットのご案内`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>パスワードリセット</h2>
        <p>以下のリンクからパスワードを再設定してください：</p>
        <a href="${resetUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          パスワードを再設定する
        </a>
        <p style="margin-top: 16px; color: #6B7280; font-size: 14px;">
          このリンクは1時間で無効になります。
        </p>
        <p style="color: #6B7280; font-size: 14px;">
          心当たりがない場合は、このメールを無視してください。
        </p>
      </div>
    `,
  });
}
