
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { query, where, getDocs } from "firebase/firestore";
import { isValidElement } from "react";

// 共有リンク生成APIエンドポイント
export async function POST(request: NextRequest) {
  try {
    // UUIDを生成してリンクIDとして使用
    const linkId = uuidv4();
    
    // 有効期限を24時間後に設定
    const expirationTime = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // 24時間後

    // Firestoreにリンクデータを追加
    await addDoc(collection(db, "shareLinks"), {
      linkId: linkId,
      expiresAt: expirationTime,
      createdAt: Timestamp.now(),
    });

    // 生成された共有リンクを返す
    return NextResponse.json({ share_link: `http://localhost:3000/share/${linkId}` });
  } catch (error) {
    // エラーが発生した場合、エラーメッセージを返す
    return NextResponse.json({ error: "Error generating share link" }, { status: 500 });
  }
}


// 共有リンクの有効性を検証するAPIエンドポイント
export async function GET(request: NextRequest) {
  // リクエストからidパラメータを取得
  const id = request.nextUrl.searchParams.get("id");

  try {
    // FirestoreデータベースからリンクIDが一致するドキュメントを検索
    const q = query(collection(db, "shareLinks"), where("linkId", "==", id));
    const querySnapshot = await getDocs(q);

    // リンクIDに一致するドキュメントが存在しない場合、無効なリンクとみなす
    if (querySnapshot.empty) {
      return NextResponse.json({ isValid: false }, { status: 404 });
    }

    // リンクデータを取得
    const linkData = querySnapshot.docs[0].data();
    const currentTime = new Date();

    // 有効期限が現在時刻を過ぎている場合、無効なリンクとみなす
    if (linkData.expiresAt.toDate() < currentTime) {
      console.log(isValidElement)
      return NextResponse.json({ isValid: false }, { status: 404 });
    }

    // リンクが有効であることを示すレスポンスを返す
    return NextResponse.json({ isValid: true });
  } catch (error) {
    // エラーが発生した場合、エラーメッセージを含むレスポンスを返す
    return NextResponse.json({ error: "Error validating share link" }, { status: 500 });
  }
}