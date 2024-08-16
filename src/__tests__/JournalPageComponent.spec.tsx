import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { JournalPage } from "../components/JournalPage";
import { UserProvider } from "../Context/UserContext";

const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

jest.mock("../Context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useUser: () => ({ user: { id: mockUserId } }),
  setUser: jest.fn(),
  isAuthenticated: true,
  login: jest.fn(),
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

jest.mock("../utils/supabaseFunction", () => ({
  checkLastSubmission: jest.fn(),
  addJournalRecords: jest.fn(),
}));

describe("JournalPage", () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  //   (supabaseFunctions.checkLastSubmission as jest.Mock).mockResolvedValue(
  //     true
  //   );
  // });
  test("タイトルが表示されること", async () => {
    render(<JournalPage />);

    const title = await screen.findByTestId("title");
    expect(title).toBeInTheDocument();
  });

  test("インプットボックスが表示されること", async () => {
    render(<JournalPage />);

    const input = await screen.findByTestId("input");
    expect(input).toBeInTheDocument();
  });

  test("3つのジャーナルエントリー入力がないとSubmitボタンが表示されない", () => {
    render(<JournalPage />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    ["Entry 1", "Entry 2"].forEach((entry) => {
      fireEvent.change(input, { target: { value: entry } });
      const addButton = screen.getByTestId("add-button");
      fireEvent.click(addButton);
    });

    const submitButton = screen.queryByText("Submit");
    expect(submitButton).toHaveClass("hidden");
  });

  test("3つのジャーナルエントリー入力後にSubmitボタンが表示される", () => {
    render(<JournalPage />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    const submitButton = screen.queryByText("Submit");
    expect(submitButton).toHaveClass("hidden");

    ["Entry 1", "Entry 2", "Entry 3"].forEach((entry) => {
      fireEvent.change(input, { target: { value: entry } });
      const addButton = screen.getByTestId("add-button");
      fireEvent.click(addButton);
    });
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  // test("Submitボタンを押すとレスポンスページに遷移すること", async () => {
  //   render(
  //     <UserProvider>
  //       <JournalPage />
  //     </UserProvider>
  //   );

  //   const input = screen.getByTestId("input") as HTMLInputElement;

  //   ["Entry 1", "Entry 2", "Entry 3"].forEach((entry) => {
  //     fireEvent.change(input, { target: { value: entry } });
  //     const addButton = screen.getByTestId("add-button");
  //     fireEvent.click(addButton);
  //   });

  //   const submitButton = await screen.findByTestId("submit");
  //   expect(submitButton).toBeInTheDocument();
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockedNavigator).toHaveBeenCalledWith("/response");
  //   });
  // });

  test("Journal Calendarボタンを押すとカレンダーページに遷移すること", async () => {
    render(
      <UserProvider>
        <JournalPage />
      </UserProvider>
    );

    const calendarButton = await screen.findByTestId("calendar");
    fireEvent.click(calendarButton);

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith("/calendar");
    });
  });
});
