import { useState, useEffect } from "react";

import { Calendar } from "../@/components/ui/calendar";
import {
  fetchHighlightedDates,
  handleDateSelect,
} from "../utils/supabaseFunction";

interface DateItem {
  created_at: string;
}

interface ContentItem {
  content: string[];
}

function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const dates = await fetchHighlightedDates();
        if (Array.isArray(dates)) {
          setHighlightedDates(
            dates.map((item: DateItem) => new Date(item.created_at))
          );
        } else {
          console.error("Fetched dates are not in expected format:", dates);
        }
      } catch (error) {
        console.log("コンテンツの取得中にエラーが発生しました", error);
      }
    };
    fetchDates();
  }, []);

  const onDateSelect = async (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      try {
        const content = await handleDateSelect(selectedDate);
        setSelectedContent((content as ContentItem)?.content || null);
      } catch (error) {
        console.error("Error fetching content for selected date:", error);
        setSelectedContent(null);
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
    </div>
  );
}

export default CalendarPage;
