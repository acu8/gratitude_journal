import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CalendarPage from "../components/CalendarPage";
import { UserProvider } from "../Context/UserContext";
import { MemoryRouter } from "react-router-dom";
import {
  fetchHighlightedDates,
  handleDateSelect,
} from "../utils/supabaseFunction";

jest.mock("../utils/supabaseFunction", () => ({
  fetchHighlightedDates: jest.fn(),
  handleDateSelect: jest.fn(),
}));

const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

jest.mock("../Context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useUser: () => ({ user: { id: mockUserId } }),
}));

describe("CalendarPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("カレンダーが表示される", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <CalendarPage />
        </UserProvider>
      </MemoryRouter>
    );

    const calendar = await screen.findByTestId("calendar");

    expect(calendar).toBeInTheDocument();
  });

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

  test("ジャーナル投稿した日がカレンダーでハイライトされている", async () => {
    const mockHighlightedDates = [
      new Date("2024-08-01"),
      new Date("2024-08-15"),
    ];

    (fetchHighlightedDates as jest.Mock).mockResolvedValue(
      mockHighlightedDates.map((date) => ({ created_at: date.toISOString() }))
    );

    render(
      <MemoryRouter>
        <UserProvider>
          <CalendarPage />
        </UserProvider>
      </MemoryRouter>
    );

    const calendar = await screen.findByTestId("calendar");
    expect(calendar).toBeInTheDocument();

    mockHighlightedDates.forEach((date) => {
      const dayElement = screen.getByText(date.getDate());
      expect(dayElement).toHaveStyle("background-color: #90cdf4");
    });
  });

  test("ハイライト部分の日付をクリックすると下にジャーナル内容が表示される", async () => {
    const mockHighlightedDates = [new Date("2024-08-01")];
    const mockJournalContent = ["Journal Entry 1", "Journal Entry 2"];

    (fetchHighlightedDates as jest.Mock).mockResolvedValue(
      mockHighlightedDates.map((date) => ({ created_at: date.toISOString() }))
    );

    (handleDateSelect as jest.Mock).mockResolvedValue({
      id: 1,
      content: mockJournalContent,
    });

    (handleDateSelect as jest.Mock).mockImplementation((date, userId) => {
      console.log(
        `handleDateSelect called with date: ${date}, userId: ${userId}`
      );
      return Promise.resolve({
        id: 1,
        content: mockJournalContent,
      });
    });

    render(
      <MemoryRouter>
        <UserProvider>
          <CalendarPage />
        </UserProvider>
      </MemoryRouter>
    );

    const calendar = await screen.findByTestId("calendar");
    expect(calendar).toBeInTheDocument();

    const dayElement = screen.getByText(mockHighlightedDates[0].getDate());
    fireEvent.click(dayElement);
    console.log("After click - Component content:", screen.debug());

    console.log("Current DOM:", screen.debug());
    const journalContainer = await screen.findByTestId("journal-container");
    console.log("Journal container found:", journalContainer);
    expect(journalContainer).toBeInTheDocument();

    await waitFor(() => {
      mockJournalContent.forEach((content) => {
        expect(screen.getByText(content)).toBeInTheDocument();
      });
    });
  });
});
