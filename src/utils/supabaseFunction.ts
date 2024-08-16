import { Journal } from "../domain/journal"
import { Response } from "../domain/response";
import { User } from "../domain/user";
import { supabase } from "./supabase";

export const getJournal = async (user_id: string) => {
    const { data, error } = await supabase
      .from("journal")
      .select()
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


export const addAiResponse = async(
  user_id: string,
  journal_id:number,
  response: string,
): Promise<Response[]>  => {
  const responseData = {
      user_id,
      journal_id,
      response:response,
    };

console.log('Received user_id:', user_id);
console.log('Received content:', response);

  const { data, error } = await supabase
  .from("llm_response")
  .insert([responseData])
  .select();

  if (error) {
      console.error("Error inserting journal entry:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error("Attempted to insert:", responseData);
      throw error;
    }

return data && data.length > 0 ? data[0] : null;
};





export const fetchHighlightedDates = async (user_id: string) => {
  const { data, error } = await supabase
  .from("journal")
  .select()
  .eq("user_id", user_id)
 

  if (error) {
    console.error('Error fetching dates:', error);
  } 

  return data;
};

export const handleDateSelect = async (selectedDate: Date | undefined, user_id: string) => {
  if (!selectedDate) {
    console.error('Selected date is undefined');
    return null;
  }

  console.log('選択された日付:', selectedDate);
  // 選択された日付の開始時刻と終了時刻（JST）
  const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
  const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999);

  const startDateString = startOfDay.toISOString();
  const endDateString = endOfDay.toISOString();

  console.log(`クエリ対象の日付範囲 (JST): ${startDateString} から ${endDateString}`);

  try {
    const { data, error } = await supabase
      .from('journal')
      .select()
      .eq("user_id", user_id)
      .gte('created_at', startDateString)
      .lte('created_at', endDateString);

    console.log('クエリパラメータ:', { gte: startDateString, lte: endDateString });

    if (error) throw error;

    if (data && data.length > 0) {
      console.log('取得したデータ:', data);
      return data[0];
    } else {
      console.log(`${selectedDate.toISOString().split('T')[0]} (JST) の内容は見つかりませんでした`);
      return null;
    }
  } catch (error) {
    console.error('内容の取得中にエラーが発生しました:', error);
    return null;
  }
};


export const getAiResponse = async (selectedDate: Date | undefined, user_id: string) => {
  if (!selectedDate) {
    console.error('Selected date is undefined');
    return null;
  }

  const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
  const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999);

  const startDateString = startOfDay.toISOString();
  const endDateString = endOfDay.toISOString();
  try {
    const { data, error } = await supabase
      .from('journal')
      .select('id, created_at')
      .eq("user_id", user_id)
      .gte('created_at', startDateString)
      .lte('created_at', endDateString)
      .order('created_at', { ascending: true }) 
      .limit(1); 

      if (error) throw error;

      if (error || data.length == 0) {
        console.log('Journalテーブルから内容の取得中にエラーが発生しました:', error);

      } 
      console.log('取得したジャーナルデータ:', data);

      const { data: aiResponseData, error: aiResponseError } = await supabase 
      .from("llm_response")
      .select()
      .eq("journal_id", data[0].id)
      .order('created_at', { ascending: false }) 
      .limit(1);

      if (aiResponseError) {
        console.error('llm_responseテーブルからデータ取得中にエラーが発生しました:', aiResponseError);
        return null;
      }

      console.log("AIレスポンス", JSON.stringify(aiResponseData, null, 2));
      if (aiResponseData && aiResponseData.length > 0) {
        return aiResponseData;
      } else {
        console.log("選択された日付のAIレスポンスが見つかりません");
        return null;
      }
    } catch (error) {
      console.error('内容の取得中にエラーが発生しました:', error);
      return null;
    }
};

export const deleteContent = async (journalId: number) => {
  const { data, error } = await supabase.from("journal").delete().eq("id", journalId).select();
  if (error) {
    console.error("Error deleting content:", error);
  }
  return data;
};

export const deleteAiResponse = async (journalId: number) => {
  const { data, error } = await supabase.from("llm_response").delete().eq("id", journalId).select();
  if (error) {
    console.error("Error deleting AI response:", error);
  }
  return data;
};

export const addUserRecords = async(
  name: string,
  email: string,
  password:string,
): Promise<User[]>  => {
  const userData = {
      name,
      email,
      password
    };

  const { data, error } = await supabase
  .from("registered-users")
  .insert([userData])
  .select();

if (error) {
  console.error("Error inserting user:", error);
  throw error;
}

return data && data.length > 0 ? data[0] : null;
};


export const loginUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase
    .from('registered-users')
    .select()
    .eq('email', email)
    .single();

  if (error) {
    throw new Error('ログインに失敗しました');
  }

  if (!data) {
    throw new Error('ユーザーが見つかりません');
  }

  if (data.password !== password) {
    throw new Error('パスワードが正しくありません');
  }

  return data;
};



export const getExistedAiResponse = async (journalId: number) => {
  const { data, error } = await supabase.from("llm_response").select("response").eq("journal_id", journalId).select();
  if (error) {
    console.error("Error deleting content:", error);
  }
  return data;
};

export const checkLastSubmission = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('journal')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error checking last submission:', error);
    return false;
  }

  return data.length === 0; // データがない場合、今日はまだ送信していない
};