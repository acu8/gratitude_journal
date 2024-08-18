import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import NewUserPage from "../components/NewUserPage";
import { UserProvider } from "../Context/UserContext";
import { MemoryRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { addUserRecords } from "../utils/supabaseFunction";

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

jest.mock("../utils/supabaseFunction", () => {
  return {
    addUserRecords: jest.fn().mockResolvedValue({ success: true }),
  };
});

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

describe("LoginPage", () => {
  test("タイトルが表示されること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const title = await screen.findByTestId("title");
    expect(title).toBeInTheDocument();
  });

  test("名前の入力箇所がある", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const name = await screen.findByTestId("name");
    expect(name).toBeInTheDocument();
  });

  test("名前が未入力の場合にエラーメッセージが表示されること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const submitButton = await screen.findByTestId("submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText("名前の入力は必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("email入力箇所がある", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const email = await screen.findByTestId("email");
    expect(email).toBeInTheDocument();
  });

  test("emailが未入力の場合にエラーメッセージが表示されること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const submitButton = await screen.findByTestId("submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText("メールアドレスは必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("password入力箇所がある", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const password = await screen.findByTestId("password");
    expect(password).toBeInTheDocument();
  });

  test("passwordが未入力の場合にエラーメッセージが表示されること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const submitButton = await screen.findByTestId("submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText("パスワードは必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("新規ユーザー登録ボタンを押すとカレンダーページへ遷移すること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <NewUserPage />
        </UserProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByTestId("name");
    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");
    const submitButton = screen.getByTestId("submit");

    fireEvent.change(nameInput, { target: { value: "テスト太郎" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    await act(async () => {
      fireEvent.submit(submitButton);
    });

    await waitFor(() => {
      expect(addUserRecords).toHaveBeenCalledWith(
        "テスト太郎",
        "test@example.com",
        "password123"
      );
      expect(mockedNavigator).toHaveBeenCalledWith("/login");
    });
  });
});
