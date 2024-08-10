import { Journal } from "../domain/journal"
import { supabase } from "./supabase";

export const getJournal = async (user_id: string) => {
    const { data, error } = await supabase
      .from("journal")
      .select("content")
      .eq("user_id", user_id)
  
      if (error) {
        if (error.code === 'PGRST116') {
          console.error("Multiple users found with the same user_id. This should not happen:", error);
          throw new Error("データベースの整合性エラー: 同じuser_idを持つ複数のユーザーが見つかりました。");
        } else if (error.code === 'PGRST301') {
          console.log(`No user found with id: ${user_id}`);
          return null;
        } else {
          console.error("Error fetching user:", error);
          throw error;
        }
      }
  
    console.log(`User data:`, data);
    return data;
  };

export const addJournalRecords = async(
    user_id: string,
    entries: string[],
  ): Promise<Journal[]>  => {
    const journalData = {
        user_id,
        content:entries
      };
  
console.log('Received user_id:', user_id);
console.log('Received content:', entries);

    const { data, error } = await supabase
    .from("journal")
    .insert([journalData])
    .select();

    if (error) {
        console.error("Error inserting journal entry:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        console.error("Attempted to insert:", journalData);
        throw error;
      }

  return data && data.length > 0 ? data[0] : null;
};
