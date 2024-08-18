import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResponsePage from "../components/ResponsePage";
import { v4 as uuidv4 } from "uuid";
// import { UserProvider } from "../Context/UserContext";
// import { MemoryRouter } from "react-router-dom";
import * as supabaseFunctions from "../utils/supabaseFunction";

const mockUserId = uuidv4();
const mockSetUser = jest.fn();

jest.mock("../Context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useUser: () => ({
    user: { id: mockUserId },
    setUser: mockSetUser,
  }),
  isAuthenticated: true,
  login: jest.fn(),
}));

jest.mock("../utils/supabaseFunction", () => ({
  getJournal: jest.fn(),
  getExistedAiResponse: jest.fn(),
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

describe("ResponsePage", () => {
  beforeEach(() => {
    (supabaseFunctions.getJournal as jest.Mock).mockResolvedValue([
      {
        id: 1,
        created_at: new Date().toISOString(),
        content: [
          "テストエントリー1",
          "テストエントリー2",
          "テストエントリー3",
        ],
      },
    ]);

    (supabaseFunctions.getExistedAiResponse as jest.Mock).mockResolvedValue([
      { response: "AIの応答テスト" },
    ]);
  });

  test("タイトルが表示されること", async () => {
    render(<ResponsePage />);

    await waitFor(() => {
      screen.debug(); // これを追加
      const title = screen.getByTestId("title");
      expect(title).toBeInTheDocument();
    });
  });

  //   test("ジャーナル内容とAI応答が表示されること", async () => {
  //     await act(async () => {
  //       render(
  //         <MemoryRouter>
  //           <UserProvider>
  //             <ResponsePage />
  //           </UserProvider>
  //         </MemoryRouter>
  //       );
  //     });

  //     await waitFor(() => {
  //       expect(screen.getByText("テストエントリー1")).toBeInTheDocument();
  //       expect(screen.getByText("テストエントリー2")).toBeInTheDocument();
  //       expect(screen.getByText("テストエントリー3")).toBeInTheDocument();
  //     });

  //     // AI応答が表示されることを確認
  //     await waitFor(() => {
  //       expect(screen.getByText("AIの応答テスト")).toBeInTheDocument();
  //     });
  //   });

  //   test("カレンダーページをみるボタンが表示される", async () => {
  //     render(
  //       <UserProvider>
  //         <ResponsePage />
  //       </UserProvider>
  //     );

  //     const calendarButton = await screen.findByTestId("calendar");

  //     expect(calendarButton).toBeInTheDocument();
  //   });

  //   test("ボタンを押すとカレンダーページへ遷移する", async () => {
  //     render(
  //       <UserProvider>
  //         <ResponsePage />
  //       </UserProvider>
  //     );

  //     const calendarButton = await screen.findByTestId("calendar");

  //     expect(calendarButton).toBeInTheDocument();
  //     fireEvent.click(calendarButton);

  //     await waitFor(() => {
  //       expect(mockedNavigator).toHaveBeenCalledWith("/calendar");
  //     });
  //   });
});
