import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../components/Login";
import { UserProvider } from "../Context/UserContext";
import { MemoryRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// import * as supabaseFunctions from "../utils/supabaseFunction";

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
  loginUser: jest
    .fn()
    .mockResolvedValue({ id: "123e4567-e89b-12d3-a456-426614174000" }),
}));

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
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

describe("LoginPage", () => {
  test("タイトルが表示されること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    const title = await screen.findByTestId("title");
    expect(title).toBeInTheDocument();
  });

  test("email入力箇所がある", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <LoginPage />
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
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    const loginButton = await screen.findByTestId("login-button");
    fireEvent.click(loginButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText("メールアドレスは必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("Password入力箇所がある", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    const password = await screen.findByTestId("password");
    expect(password).toBeInTheDocument();
  });

  test("Passwordが未入力の場合にエラーメッセージが表示されること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    const loginButton = await screen.findByTestId("login-button");
    fireEvent.click(loginButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText("パスワードの入力は必須です");
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("ログインボタンを押すとカレンダーページへ遷移すること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");
    const loginButton = screen.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    await act(async () => {
      fireEvent.submit(loginButton);
    });

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith("/calendar");
    });
  });

  test("新規ユーザー登録ボタンが表示されること", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    const newUserButton = await screen.findByTestId("new-user");
    expect(newUserButton).toBeInTheDocument();
  });

  test("ボタンをクリックするとユーザー新規登録ページへ遷移する", async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <LoginPage />
        </UserProvider>
      </MemoryRouter>
    );

    const newUserButton = await screen.findByTestId("new-user");
    expect(newUserButton).toBeInTheDocument();
    fireEvent.click(newUserButton);

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith("/newuser");
    });
  });
});
