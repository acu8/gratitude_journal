import { useState, useEffect } from "react";
import { getJournal, addAiResponse } from "../utils/supabaseFunction";
import { Link } from "react-router-dom";
import axios from "axios";

type JournalEntry = {
  id?: number;
  content: string[];
};

type JournalData = JournalEntry[] | null;

function ResponsePage() {
  const [journalData, setJournalData] = useState<JournalData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJournal("bc45252b-6f56-497d-9b5c-e13db27db01b");
        setJournalData(data as JournalData);
      } catch (error) {
        console.error("エラーが発生しました:", error);
        setError(
          error instanceof Error ? error.message : "不明なエラーが発生しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const aiResponse = async () => {
      if (!journalData) return;
      try {
        const content = journalData[0].content.join(" ");
        console.log("Request Content:", content);

        const combinedPrompt = `
                システムインストラクション: あなたはユーザーの日記を読み、共感的で洞察力のあるフィードバックを提供する心理カウンセラーです。
                ユーザーの感情を理解し、前向きなコメントを提供してください。明日1日を前向きで始められるように文章を終わらしてください。
                
                ユーザーの日記:
                ${content}

                回答は簡潔にまとめ、全体で200字程度に収めてください。`;

        const result = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
          {
            contents: [{ parts: [{ text: combinedPrompt }] }],
            generationConfig: {
              temperature: 0.9,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
              stopSequences: [],
            },
            safetySettings: [],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              key: process.env.VITE_GEMINI_API_KEY,
            },
          }
        );
        console.log("API Response:", JSON.stringify(result.data, null, 2));
        if (result.data.candidates && result.data.candidates.length > 0) {
          const candidateContent = result.data.candidates[0].content;
          if (
            candidateContent &&
            candidateContent.parts &&
            candidateContent.parts.length > 0
          ) {
            const aiResponseText = candidateContent.parts[0].text;
            try {
              const journalId = journalData[0].id;
              if (journalId === undefined) {
                throw new Error("Journal IDが見つかりません");
              }
              const responseResult = await addAiResponse(
                "bc45252b-6f56-497d-9b5c-e13db27db01b",
                journalId,
                aiResponseText
              );
              console.log(
                "AIレスポンスがデータベースに保存されました:",
                responseResult
              );
            } catch (error) {
              console.error(
                "AIレスポンスの保存中にエラーが発生しました:",
                error
              );
              if (error instanceof Error) {
                setError(error.message);
              } else {
                setError("AIレスポンスの保存中に不明なエラーが発生しました");
              }
            }
            setResponse(aiResponseText);
            console.log("抽出されたレスポンス:", aiResponseText);
          } else {
            console.error("予期せぬレスポンス構造:", candidateContent);
            setError("AIレスポンスの構造が予期せぬものでした。");
          }
        } else {
          console.error("レスポンスに候補がありません");
          setError("AIレスポンスに候補が含まれていませんでした。");
        }
      } catch (error) {
        console.error("エラー:", error);
        if (axios.isAxiosError(error)) {
          console.error("レスポンスデータ:", error.response?.data);
          console.error("ステータスコード:", error.response?.status);
          console.error(
            "エラー詳細:",
            JSON.stringify(error.response?.data, null, 2)
          );
        }
        setError("AIレスポンスの取得に失敗しました。");
      }
    };
    aiResponse();
  }, [journalData]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!journalData)
    return <div>ユーザーのジャーナルデータが見つかりません</div>;

  const targetEntry =
    journalData && journalData.length > 0 ? journalData[0] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">ResponsePage</h1>
      {targetEntry ? (
        <div className="journal-content">
          <h2 className="text-lg mb-2">あなたが入力したジャーナル内容：</h2>
          <ul className="list-disc pl-5">
            {targetEntry.content.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>ジャーナルエントリーが見つかりません</div>
      )}
      {response && (
        <div className="ai-response mt-4">
          <h2 className="text-lg mb-2">AI応答：</h2>
          <p>{response}</p>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <Link
          to="/calendar"
          className="mt-4"
          style={{ textDecoration: "none" }}
        >
          <button className="btn btn-outline btn-success mt-4 cursor: cursor-pointer">
            Journal Calendar
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ResponsePage;
