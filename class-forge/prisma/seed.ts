// ===========================================
// ClassForge シードデータ
// 3講座 × 3〜5セクション × 3〜6レッスン
// ===========================================

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:password@localhost:5432/classforge?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin ユーザー作成
  const passwordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@classforge.jp" },
    update: {
      passwordHash,
    },
    create: {
      email: "admin@classforge.jp",
      name: "管理者",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // ------------------------------------------------------------------
  // Course 1: ChatGPT仕事術入門
  // ------------------------------------------------------------------
  const course1 = await prisma.course.upsert({
    where: { slug: "chatgpt-business" },
    update: {},
    create: {
      title: "ChatGPT仕事術入門",
      slug: "chatgpt-business",
      description:
        "ChatGPTを使って仕事を劇的に効率化する実践講座。\n\n" +
        "文書作成・メール返信・会議資料・データ分析まで、AIを道具として使いこなすスキルを最短で習得します。\n" +
        "プロンプトの書き方から始まり、業務への組み込み方まで、実例ベースで丁寧に解説します。",
      price: 9800,
      status: "PUBLISHED",
    },
  });

  const c1Exists = await prisma.section.findFirst({ where: { courseId: course1.id } });
  if (!c1Exists) {
    // Section 1: 基本操作
    const c1s1 = await prisma.section.create({
      data: { courseId: course1.id, title: "ChatGPTの基本操作", sortOrder: 0 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course1.id, sectionId: c1s1.id, title: "ChatGPTとは何か？できることとできないこと", slug: "what-is-chatgpt", sortOrder: 0, isPreview: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "ChatGPTの概要と基本的な使い方について解説します。", duration: 480 },
        { courseId: course1.id, sectionId: c1s1.id, title: "アカウント作成と初期設定", slug: "account-setup", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "ChatGPTのアカウントを作成し、初期設定を行います。", duration: 360 },
        { courseId: course1.id, sectionId: c1s1.id, title: "最初の会話を始めよう", slug: "first-chat", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "実際にChatGPTと会話してみましょう。", duration: 420 },
        { courseId: course1.id, sectionId: c1s1.id, title: "返答の精度を上げるコツ", slug: "improve-accuracy", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "より良い返答を引き出すテクニックを学びます。", duration: 540 },
      ],
    });

    // Section 2: 仕事での活用
    const c1s2 = await prisma.section.create({
      data: { courseId: course1.id, title: "仕事での活用シーン", sortOrder: 1 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course1.id, sectionId: c1s2.id, title: "メール文章を10秒で作成する", slug: "email-writing", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "ビジネスメールをAIで素早く作成する方法です。", duration: 600 },
        { courseId: course1.id, sectionId: c1s2.id, title: "会議議事録の自動要約", slug: "meeting-minutes", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "会議の録音テキストをChatGPTで要約します。", duration: 480 },
        { courseId: course1.id, sectionId: c1s2.id, title: "プレゼン資料の構成を作る", slug: "presentation-outline", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "プレゼンテーションの構成をAIで設計します。", duration: 720 },
        { courseId: course1.id, sectionId: c1s2.id, title: "データ分析レポートの解釈支援", slug: "data-analysis", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "数字データをAIに読み解かせる方法を学びます。", duration: 660 },
        { courseId: course1.id, sectionId: c1s2.id, title: "社内マニュアル・FAQ作成", slug: "manual-creation", sortOrder: 4, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "業務マニュアルやFAQをAIで効率的に作成します。", duration: 540 },
      ],
    });

    // Section 3: プロンプト設計
    const c1s3 = await prisma.section.create({
      data: { courseId: course1.id, title: "プロンプト設計の実践", sortOrder: 2 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course1.id, sectionId: c1s3.id, title: "役割指定（ロールプロンプト）", slug: "role-prompting", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "AIに役割を与えて出力品質を高める手法です。", duration: 480 },
        { courseId: course1.id, sectionId: c1s3.id, title: "Few-shotプロンプティング", slug: "few-shot-prompting", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "例示を与えてAIの出力パターンを制御します。", duration: 600 },
        { courseId: course1.id, sectionId: c1s3.id, title: "Chain-of-Thoughtで思考を整理", slug: "chain-of-thought", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "複雑な問題をステップバイステップで解かせます。", duration: 720 },
        { courseId: course1.id, sectionId: c1s3.id, title: "自分専用プロンプトライブラリの作り方", slug: "prompt-library", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "再利用できるプロンプトを整理・管理する方法です。", duration: 540 },
      ],
    });

    // Section 4: 応用・自動化
    const c1s4 = await prisma.section.create({
      data: { courseId: course1.id, title: "応用と自動化", sortOrder: 3 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course1.id, sectionId: c1s4.id, title: "ChatGPT APIで業務を自動化する", slug: "api-automation", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "APIを使ってChatGPTを自社業務に組み込む方法です。", duration: 900 },
        { courseId: course1.id, sectionId: c1s4.id, title: "Zapier/Makeと連携する", slug: "zapier-make", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "ノーコードツールと組み合わせて自動化フローを作ります。", duration: 780 },
        { courseId: course1.id, sectionId: c1s4.id, title: "総まとめ：あなたのAI活用計画を立てる", slug: "summary-plan", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "学んだことを整理し、職場でのAI活用計画を立てます。", duration: 600 },
      ],
    });

    console.log("Course 1 created:", course1.title);
  }

  // ------------------------------------------------------------------
  // Course 2: 副業AI活用講座
  // ------------------------------------------------------------------
  const course2 = await prisma.course.upsert({
    where: { slug: "side-business-ai" },
    update: {},
    create: {
      title: "副業AI活用講座",
      slug: "side-business-ai",
      description:
        "AIを使って副業を始め、月5〜10万円の収入を作るための実践講座。\n\n" +
        "ライティング・SNS運用・動画制作・翻訳など、AIが最も力を発揮する副業ジャンルを厳選。\n" +
        "ゼロから受注して稼ぐまでの全ステップを、実例とともに解説します。",
      price: 14800,
      status: "PUBLISHED",
    },
  });

  const c2Exists = await prisma.section.findFirst({ where: { courseId: course2.id } });
  if (!c2Exists) {
    // Section 1: 基礎知識
    const c2s1 = await prisma.section.create({
      data: { courseId: course2.id, title: "副業とAIの基礎知識", sortOrder: 0 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course2.id, sectionId: c2s1.id, title: "なぜ今AIで副業なのか", slug: "why-ai-sidejob", sortOrder: 0, isPreview: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "AIが副業に革命をもたらしている理由を解説します。", duration: 480 },
        { courseId: course2.id, sectionId: c2s1.id, title: "AIツール全体マップ（2024年版）", slug: "ai-tools-map", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "副業に使えるAIツールを体系的に把握します。", duration: 600 },
        { courseId: course2.id, sectionId: c2s1.id, title: "副業で稼ぐ3つのモデル", slug: "three-models", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "AIを使った副業の主要な収益モデルを紹介します。", duration: 540 },
      ],
    });

    // Section 2: コンテンツ作成
    const c2s2 = await prisma.section.create({
      data: { courseId: course2.id, title: "コンテンツ作成の自動化", sortOrder: 1 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course2.id, sectionId: c2s2.id, title: "AIライティングで記事を量産する", slug: "ai-writing", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "AIを使ってSEO記事を効率的に作成する方法です。", duration: 720 },
        { courseId: course2.id, sectionId: c2s2.id, title: "SNS投稿を自動生成する", slug: "sns-automation", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "X・Instagram・LinkedInの投稿をAIで作成します。", duration: 600 },
        { courseId: course2.id, sectionId: c2s2.id, title: "MidjourneyでAI画像を作る", slug: "midjourney-images", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "画像生成AIでクリエイティブを量産する方法です。", duration: 780 },
        { courseId: course2.id, sectionId: c2s2.id, title: "動画スクリプト → ナレーション自動化", slug: "video-script", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "AIで動画コンテンツを効率的に制作します。", duration: 840 },
        { courseId: course2.id, sectionId: c2s2.id, title: "多言語翻訳・ローカライズ案件の受け方", slug: "translation-work", sortOrder: 4, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "AI翻訳を活用した翻訳副業の始め方です。", duration: 660 },
      ],
    });

    // Section 3: 顧客対応・マーケティング
    const c2s3 = await prisma.section.create({
      data: { courseId: course2.id, title: "顧客対応とマーケティング", sortOrder: 2 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course2.id, sectionId: c2s3.id, title: "クラウドソーシングでの提案文をAIで書く", slug: "crowdsourcing-proposal", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "ランサーズ・クラウドワークスの提案をAIで最適化します。", duration: 600 },
        { courseId: course2.id, sectionId: c2s3.id, title: "ポートフォリオサイトをAIで作る", slug: "portfolio-site", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "自分のスキルを見せるポートフォリオをAIで作成します。", duration: 720 },
        { courseId: course2.id, sectionId: c2s3.id, title: "リピーター獲得のフォローアップ戦略", slug: "followup-strategy", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "顧客との関係を継続するためのAI活用法です。", duration: 480 },
        { courseId: course2.id, sectionId: c2s3.id, title: "料金交渉・単価アップの方法", slug: "price-negotiation", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "副業の単価を上げるための具体的な戦略です。", duration: 540 },
      ],
    });

    // Section 4: 収益化・拡大
    const c2s4 = await prisma.section.create({
      data: { courseId: course2.id, title: "収益化と拡大戦略", sortOrder: 3 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course2.id, sectionId: c2s4.id, title: "月5万円を達成するロードマップ", slug: "50k-roadmap", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "副業で月5万円を稼ぐための具体的なステップです。", duration: 660 },
        { courseId: course2.id, sectionId: c2s4.id, title: "外注化・チーム化で収入を拡大する", slug: "outsourcing", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "AIと人材を組み合わせてスケールする方法です。", duration: 720 },
        { courseId: course2.id, sectionId: c2s4.id, title: "税務・確定申告の基本知識", slug: "tax-basics", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "副業収入の確定申告と節税の基礎知識です。", duration: 600 },
        { courseId: course2.id, sectionId: c2s4.id, title: "副業から独立へ：次のステージへの準備", slug: "independence-prep", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "副業を本業化するための判断基準と準備です。", duration: 780 },
      ],
    });

    // Section 5: 実践ロードマップ
    const c2s5 = await prisma.section.create({
      data: { courseId: course2.id, title: "実践ロードマップ", sortOrder: 4 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course2.id, sectionId: c2s5.id, title: "今すぐ始める7日間アクションプラン", slug: "7day-action-plan", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "最初の1週間でやることを具体的に解説します。", duration: 540 },
        { courseId: course2.id, sectionId: c2s5.id, title: "継続するためのマインドセット", slug: "mindset", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "副業を長期的に続けるための考え方です。", duration: 480 },
        { courseId: course2.id, sectionId: c2s5.id, title: "コース総まとめ＆受講生Q&A", slug: "course-summary-qa", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "コースの総まとめと受講生からのよくある質問への回答です。", duration: 720 },
      ],
    });

    console.log("Course 2 created:", course2.title);
  }

  // ------------------------------------------------------------------
  // Course 3: 非エンジニア向け自動化入門（無料）
  // ------------------------------------------------------------------
  const course3 = await prisma.course.upsert({
    where: { slug: "no-code-automation" },
    update: {},
    create: {
      title: "非エンジニア向け自動化入門",
      slug: "no-code-automation",
      description:
        "プログラミング不要で業務を自動化できる！ノーコードツールの入門講座。\n\n" +
        "Zapier・Make（旧Integromat）・Notionなど、エンジニアでなくても使えるツールを活用し、\n" +
        "繰り返し作業をゼロにする具体的な手順を学びます。",
      price: 0,
      status: "PUBLISHED",
    },
  });

  const c3Exists = await prisma.section.findFirst({ where: { courseId: course3.id } });
  if (!c3Exists) {
    // Section 1: 自動化の考え方
    const c3s1 = await prisma.section.create({
      data: { courseId: course3.id, title: "自動化の考え方", sortOrder: 0 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course3.id, sectionId: c3s1.id, title: "なぜ自動化が必要なのか", slug: "why-automation", sortOrder: 0, isPreview: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "業務自動化のメリットと基本的な考え方を解説します。", duration: 420 },
        { courseId: course3.id, sectionId: c3s1.id, title: "自動化できる作業・できない作業", slug: "automation-scope", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "自動化に向いている作業の見極め方を学びます。", duration: 480 },
        { courseId: course3.id, sectionId: c3s1.id, title: "ツール選定の考え方", slug: "tool-selection", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "目的に合ったノーコードツールの選び方です。", duration: 360 },
      ],
    });

    // Section 2: ノーコードツール入門
    const c3s2 = await prisma.section.create({
      data: { courseId: course3.id, title: "ノーコードツール入門", sortOrder: 1 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course3.id, sectionId: c3s2.id, title: "Zapierで最初のZapを作る", slug: "first-zap", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "Zapierを使って最初の自動化フローを作成します。", duration: 720 },
        { courseId: course3.id, sectionId: c3s2.id, title: "Make（旧Integromat）でシナリオ設計", slug: "make-scenario", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "Makeを使った複雑な自動化シナリオの作り方です。", duration: 840 },
        { courseId: course3.id, sectionId: c3s2.id, title: "Notionデータベースを使った情報管理", slug: "notion-database", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "Notionを活用した情報整理と自動化の連携方法です。", duration: 660 },
        { courseId: course3.id, sectionId: c3s2.id, title: "Google スプレッドシートの自動集計", slug: "sheets-automation", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "スプレッドシートとAPIを組み合わせた自動集計です。", duration: 600 },
      ],
    });

    // Section 3: 実践プロジェクト
    const c3s3 = await prisma.section.create({
      data: { courseId: course3.id, title: "実践プロジェクト", sortOrder: 2 },
    });
    await prisma.lesson.createMany({
      data: [
        { courseId: course3.id, sectionId: c3s3.id, title: "フォーム入力 → メール通知を自動化", slug: "form-to-email", sortOrder: 0, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "Googleフォームの回答を自動でメール通知する仕組みです。", duration: 660 },
        { courseId: course3.id, sectionId: c3s3.id, title: "SNS投稿を予約・自動化する", slug: "sns-scheduling", sortOrder: 1, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "SNSの投稿スケジュールを自動化する方法です。", duration: 540 },
        { courseId: course3.id, sectionId: c3s3.id, title: "売上データの自動レポート生成", slug: "sales-report", sortOrder: 2, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "売上データを自動で集計してレポートを生成します。", duration: 720 },
        { courseId: course3.id, sectionId: c3s3.id, title: "まとめ：あなたの業務に合った自動化プラン", slug: "automation-plan", sortOrder: 3, isPreview: false, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", content: "自分の業務に合った自動化計画を立てます。", duration: 480 },
      ],
    });

    console.log("Course 3 created:", course3.title);
  }

  console.log("\nSeed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
