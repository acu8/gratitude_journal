import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CalendarPage from "../components/CalendarPage";
// import { UserProvider } from "../Context/UserContext";
// import { MemoryRouter } from "react-router-dom";
import * as supabaseFunction from "../utils/supabaseFunction";

jest.mock("../utils/supabaseFunction");
jest.mock("../Context/UserContext", () => ({
  useUser: () => ({ user: { id: "test-user-id" } }),
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigator,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        mockedNavigator(to);
      }}
    >
      {children}
    </a>
  ),
}));

describe("CalendarPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test("カレンダーが表示される", async () => {
  //   render(
  //     <MemoryRouter>
  //       <UserProvider>
  //         <CalendarPage />
  //       </UserProvider>
  //     </MemoryRouter>
  //   );

  //   const calendar = await screen.findByTestId("calendar");

  //   expect(calendar).toBeInTheDocument();
  // });

  // test("カレンダーページをみるボタンが表示される", async () => {
  //   render(
  //     <UserProvider>
  //       <ResponsePage />
  //     </UserProvider>
  //   );

  //   const calendarButton = await screen.findByTestId("calendar");

  //   expect(calendarButton).toBeInTheDocument();
  //   fireEvent.click(calendarButton);

  //   await waitFor(() => {
  //     expect(mockedNavigator).toHaveBeenCalledWith("/calendar");
  //   });
  // });

  // test("ジャーナル投稿した日がカレンダーでハイライトされている", async () => {
  //   const mockHighlightedDates = [
  //     new Date("2024-08-01"),
  //     new Date("2024-08-15"),
  //   ];

  //   (fetchHighlightedDates as jest.Mock).mockResolvedValue(
  //     mockHighlightedDates.map((date) => ({ created_at: date.toISOString() }))
  //   );

  //   render(
  //     <MemoryRouter>
  //       <UserProvider>
  //         <CalendarPage />
  //       </UserProvider>
  //     </MemoryRouter>
  //   );

  //   const calendar = await screen.findByTestId("calendar");
  //   expect(calendar).toBeInTheDocument();

  //   mockHighlightedDates.forEach((date) => {
  //     const dayElement = screen.getByText(date.getDate());
  //     expect(dayElement).toHaveStyle("background-color: #90cdf4");
  //   });
  // });

  test("カレンダーが表示され、日付選択に応答する", async () => {
    const mockHighlightedDates = [new Date("2024-08-01")];
    const mockJournalContent = ["Journal Entry 1"];
    const mockAiResponse = "AI Response";

    (supabaseFunction.fetchHighlightedDates as jest.Mock).mockResolvedValue(
      mockHighlightedDates.map((date) => ({ created_at: date.toISOString() }))
    );
    (supabaseFunction.handleDateSelect as jest.Mock).mockResolvedValue({
      id: 1,
      content: mockJournalContent,
    });
    (supabaseFunction.getAiResponse as jest.Mock).mockResolvedValue([
      { response: mockAiResponse },
    ]);

    render(<CalendarPage />);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();

    await waitFor(() => {
      const highlightedDate = screen.getByText("1");
      expect(highlightedDate).toHaveStyle(
        "background-color: rgb(144, 205, 244)"
      );
    });

    const dayElement = screen.getByText("1");
    fireEvent.click(dayElement);

    await waitFor(() => {
      expect(screen.getByText("Journal Entry 1")).toBeInTheDocument();
      expect(screen.getByText("AI Response")).toBeInTheDocument();
    });

    expect(screen.getByText("投稿を削除する")).toBeInTheDocument();

    const deleteButton = screen.getByText("投稿を削除する");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Journal Entry 1")).not.toBeInTheDocument();
      expect(screen.queryByText("AI Response")).not.toBeInTheDocument();
      const deleteButton = screen.queryByText("投稿を削除する");
      expect(deleteButton).toHaveClass("hidden");
    });
  });

  test("エラー時にジャーナルコンテンツとAIレスポンスが表示されない", async () => {
    (supabaseFunction.fetchHighlightedDates as jest.Mock).mockResolvedValue([]);
    (supabaseFunction.handleDateSelect as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );
    (supabaseFunction.getAiResponse as jest.Mock).mockRejectedValue(
      new Error("AI API Error")
    );

    render(<CalendarPage />);

    expect(screen.getByTestId("calendar")).toBeInTheDocument();

    const dayElement = screen.getByText("1");
    fireEvent.click(dayElement);

    await waitFor(() => {
      expect(screen.queryByText("Journal Entry 1")).not.toBeInTheDocument();
      expect(screen.queryByText("AI Response")).not.toBeInTheDocument();
      const deleteButton = screen.queryByText("投稿を削除する");
      expect(deleteButton).toHaveClass("hidden");
    });
  });

  test("新規投稿ボタンが表示される", async () => {
    render(<CalendarPage />);

    const newJournalButton = await screen.findByTestId("new-journal");

    expect(newJournalButton).toBeInTheDocument();
    fireEvent.click(newJournalButton);

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith("/journal");
    });
  });
});
