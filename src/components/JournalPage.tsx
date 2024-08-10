import { useState, ChangeEvent } from "react";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { addJournalRecords } from "../utils/supabaseFunction";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  entries: string[];
}

function JournalPage() {
  const { handleSubmit, reset } = useForm<IFormInput>();
  const [journal, setJournal] = useState<string>("");
  const [entries, setEntries] = useState<string[]>([]);
  const navigate = useNavigate();

  const onChangeJournal = (event: ChangeEvent<HTMLInputElement>) =>
    setJournal(event.target.value);

  const addEntry = () => {
    if (journal.trim() !== "") {
      setEntries([...entries, journal]);
      setJournal("");
    }
  };

  const onSubmitJournal: SubmitHandler<IFormInput> = async () => {
    try {
      const user_id = "bc45252b-6f56-497d-9b5c-e13db27db01b"; // 仮の値
      await addJournalRecords(user_id, entries);

      reset();
      navigate(`/response`);
    } catch (error) {
      console.log("コンテンツの登録中にエラーが発生しました", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gratitude Journal</h1>
      <p className="mb-4">What are you grateful for today?</p>
      <form onSubmit={handleSubmit(onSubmitJournal)}>
        <div>
          <label
            htmlFor="journal"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Text five things you are grateful for today
          </label>

          <div className="flex items-center space-x-2">
            <Input
              id="journal"
              name="journal"
              type="text"
              value={journal}
              onChange={onChangeJournal}
              placeholder="Enter your gratitude..."
              className="flex-grow"
            />
            <Button
              type="button"
              size="icon"
              onClick={addEntry}
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
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Your Gratitude List:</h2>
          <ul className="list-disc pl-5 space-y-2">
            {entries.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            {entries.length == 3 ? (
              <Button type="submit">Submit</Button>
            ) : (
              <Button className="hidden">Submit</Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default JournalPage;
