import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  addJournalRecords,
  checkLastSubmission,
} from "../utils/supabaseFunction";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { Link } from "react-router-dom";

interface IFormInput {
  entries: string[];
}

export function JournalPage() {
  const { handleSubmit, reset } = useForm<IFormInput>();
  const [journal, setJournal] = useState<string>("");
  const [entries, setEntries] = useState<string[]>([]);
  const [canSubmit, setCanSubmit] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useUser();

  const onChangeJournal = (event: ChangeEvent<HTMLInputElement>) => {
    setJournal(event.target.value);
  };

  const addEntry = () => {
    if (journal.trim() !== "") {
      setEntries([...entries, journal]);
      setJournal("");
      setError("");
    }
  };

  useEffect(() => {
    console.log("Current user in JournalPage:", user);
    checkSubmissionEligibility();
  }, [user]);

  const checkSubmissionEligibility = async () => {
    if (user && user.id) {
      const canSubmitToday = await checkLastSubmission(user.id);
      setCanSubmit(canSubmitToday);
      if (!canSubmitToday) {
        setError("今日のジャーナルを投稿済みです。明日に戻ってきてください!");
      } else {
        setError("");
      }
    }
  };

  const onSubmitJournal: SubmitHandler<IFormInput> = async () => {
    try {
      if (user && user.id && canSubmit) {
        await addJournalRecords(user.id, entries);
        reset();
        navigate(`/response`);
      } else if (!canSubmit) {
        setError("今日はすでにジャーナルを送信しています。");
      } else {
        console.log("有効なユーザーIDが見つかりません", user);
      }
    } catch (error) {
      console.log("コンテンツの登録中にエラーが発生しました", error);
    }
  };

  // デバッグ用のuseEffect
  useEffect(() => {
    console.log("Current state - canSubmit:", canSubmit, "error:", error);
  }, [canSubmit, error]);

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/nightai.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="md bg-white/50 backdrop-blur-sm rounded-lg shadow-md p-6">
        <h1
          className="text-2xl font-bold mb-4 text-gray-600"
          data-testid="title"
        >
          Arigatou Journal
        </h1>
        <p className="mb-6 text-gray-600">
          今日はどんなことに「ありがとう」と言いたいですか？
        </p>
        <form onSubmit={handleSubmit(onSubmitJournal)}>
          <div>
            <label
              htmlFor="journal"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              感謝できることを３つ書いてみてください。
            </label>

            <div className="flex items-center space-x-2 w-full">
              <Input
                id="journal"
                name="journal"
                type="text"
                value={journal}
                onChange={onChangeJournal}
                placeholder="Enter your gratitude..."
                className="flex-grow"
                data-testid="input"
                // disabled={!canSubmit}
              />
              <Button
                type="button"
                size="icon"
                onClick={addEntry}
                data-testid="add-button"
                className="w-10 h-9 rounded-full text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 mt-2" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6">
            <h2 className="text-md font-semibold mb-2 text-gray-600">
              あなたの今日の感謝リスト:
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              {entries.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
            <div className="flex justify-end mt-10">
              {entries.length == 3 ? (
                <Button type="submit" data-testid="submit">
                  Submit
                </Button>
              ) : (
                <Button className="hidden">Submit</Button>
              )}
            </div>
          </div>
        </form>
        <div className="flex justify-end mt-4">
          <Link
            to="/calendar"
            className="mt-4"
            style={{ textDecoration: "none" }}
          >
            <button
              data-testid="calendar"
              className="bg-gradient-to-b from-yellow-200 to-yellow-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-10"
            >
              過去のジャーナルを見る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// export default JournalPage;
