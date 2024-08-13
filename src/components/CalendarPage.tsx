import { useState, useEffect } from "react";

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
        const content = await handleDateSelect(selectedDate);
        setSelectedContent((content as ContentItem)?.content || null);
        setSelectedJournalId((content as ContentItem)?.id || null);
        const aiResponseResult: AiResponse = await getAiResponse(selectedDate);
        if (aiResponseResult && aiResponseResult.length > 0) {
          setSelectedResponse(aiResponseResult[0].response);
        } else {
          console.log("No valid AI response available for the selected date");
          setSelectedResponse(null);
        }
      } catch (error) {
        console.error(
          "選択された日付のコンテンツ取得中にエラーが発生しました:",
          error
        );
        setSelectedContent(null);
        setSelectedResponse(null);
      }
    }
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate: Date | undefined) => onDateSelect(newDate)}
        className="rounded-md border"
        modifiers={{
          highlighted: highlightedDates,
        }}
        modifiersStyles={{
          highlighted: { backgroundColor: "#90cdf4" },
        }}
      />
      {selectedContent && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
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
  );
}

export default CalendarPage;
