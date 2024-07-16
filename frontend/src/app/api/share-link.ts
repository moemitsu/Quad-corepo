
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { query, where, getDocs } from "firebase/firestore";

// 共有リンク生成APIエンドポイント
export async function POST(request: NextRequest) {
  try {
    const linkId = uuidv4();
    const expirationTime = Timestamp.fromDate(new Date(Date.now() + 60 * 60 * 1000)); // 1時間後

    await addDoc(collection(db, "shareLinks"), {
      linkId: linkId,
      expiresAt: expirationTime,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ share_link: `http://localhost:3000/share/${linkId}` });
  } catch (error) {
    return NextResponse.json({ error: "Error generating share link" }, { status: 500 });
  }
}

// 共有リンク検証APIエンドポイント
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  try {
    const q = query(collection(db, "shareLinks"), where("linkId", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ isValid: false }, { status: 404 });
    }

    const linkData = querySnapshot.docs[0].data();
    const currentTime = new Date();

    if (linkData.expiresAt.toDate() < currentTime) {
      return NextResponse.json({ isValid: false }, { status: 404 });
    }

    return NextResponse.json({ isValid: true });
  } catch (error) {
    return NextResponse.json({ error: "Error validating share link" }, { status: 500 });
  }
}
