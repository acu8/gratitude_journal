import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "../@/components/ui/calendar";
import {
  fetchHighlightedDates,
  handleDateSelect,
  getAiResponse,
  deleteContent,
  deleteAiResponse,
} from "../utils/supabaseFunction";
import { useUser } from "../Context/UserContext";

interface DateItem {
  created_at: string;
}

interface ContentItem {
  id: number | null;
  content: string[];
}

interface AiResponseItem {
  response: string;
}

type AiResponse = AiResponseItem[] | null;

function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[] | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [selectedJournalId, setSelectedJournalId] = useState<number | null>(
    null
  );
  const { user } = useUser();

  useEffect(() => {
    const fetchDates = async () => {
      try {
        if (user && user.id) {
          const dates = await fetchHighlightedDates(user.id);
          if (Array.isArray(dates)) {
            setHighlightedDates(
              dates.map((item: DateItem) => new Date(item.created_at))
            );
          } else {
            console.error("Fetched dates are not in expected format:", dates);
          }
        } else {
          console.log("有効なユーザーIDが見つかりません", user);
        }
      } catch (error) {
        console.log("コンテンツの取得中にエラーが発生しました", error);
      }
    };
    fetchDates();
  }, [user]);

  const handleDelete = async (id: number | null) => {
    if (id === null) {
      console.error("Journal ID is null, cannot delete");
      return;
    }
    try {
      await deleteContent(id);
      await deleteAiResponse(id);
      setSelectedContent(null);
      setSelectedResponse(null);
      setSelectedJournalId(null);

      if (user && user.id) {
        const updatedDates = await fetchHighlightedDates(user.id);
        if (updatedDates && Array.isArray(updatedDates)) {
          setHighlightedDates(
            updatedDates.map((item: DateItem) => new Date(item.created_at))
          );
        } else {
          console.error(
            "Updated dates are not in expected format:",
            updatedDates
          );
          setHighlightedDates([]);
        }
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const onDateSelect = async (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      try {
        if (user && user.id) {
          const content = await handleDateSelect(selectedDate, user.id);
          setSelectedContent((content as ContentItem)?.content || null);
          setSelectedJournalId((content as ContentItem)?.id || null);

          const aiResponseResult: AiResponse = await getAiResponse(
            selectedDate,
            user.id
          );
          if (
            aiResponseResult &&
            aiResponseResult.length > 0 &&
            aiResponseResult[0].response
          ) {
            setSelectedResponse(aiResponseResult[0].response);
          } else {
            console.log("No valid AI response available for the selected date");
            setSelectedResponse(null);
          }
        }
      } catch (error) {
        console.error(
          "選択された日付のコンテンツ取得中にエラーが発生しました:",
          error
        );
        setSelectedContent(null);
        setSelectedResponse(null);
        setSelectedJournalId(null);
      }
    }
  };

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-end mb-6">
            <Link to="/journal" className="" style={{ textDecoration: "none" }}>
              <button
                data-testid="new-journal"
                className="bg-gradient-to-b from-fuchsia-300 to-indigo-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                新規投稿をする
              </button>
            </Link>
          </div>
          <div className="flex justify-center items-center">
            <Calendar
              data-testid="calendar"
              mode="single"
              selected={date}
              onSelect={(newDate: Date | undefined) => onDateSelect(newDate)}
              className="rounded-md border bg-white"
              modifiers={{
                highlighted: highlightedDates,
              }}
              modifiersClassNames={{
                highlighted: "highlighted-date",
              }}
              modifiersStyles={{
                highlighted: { backgroundColor: "#90cdf4" },
              }}
            />
          </div>
        </div>
        {selectedContent && (
          <div
            className="mt-4 p-4 bg-gray-100 rounded-md"
            data-testid="journal-container"
          >
            <h3 className="font-bold">選択された日付のコンテンツ:</h3>
            <ul className="list-disc pl-5">
              {selectedContent.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          {selectedResponse ? (
            <div>
              <p>{selectedResponse}</p>
              <button
                onClick={() => handleDelete(selectedJournalId)}
                className="btn btn-outline btn-success mt-4 cursor: cursor-pointer"
              >
                投稿を削除する
              </button>
            </div>
          ) : (
            <button className="btn btn-outline btn-success mt-4 cursor: cursor-pointer hidden">
              投稿を削除する
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
