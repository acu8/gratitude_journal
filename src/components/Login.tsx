import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import { Input } from "../@/components/ui/input";
import { Label } from "../@/components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../utils/supabaseFunction";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onLogin = async (data: FormData) => {
    try {
      const user = await loginUser(data.email, data.password);
      if (user) {
        setUser(user);
        console.log("ログインが成功しました:", user);
        reset();
        navigate("/calendar");
      } else {
        console.error("ログインに失敗しました: ユーザーが見つかりません");
      }
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: "url('/hoshi.jpg')" }}
    >
      <div className="w-full max-w-md p-4">
        <Card
          className="w-full max-w-md"
          style={{ backgroundImage: "url('/hoshi.jpg')" }}
        >
          <CardHeader>
            <CardTitle data-testid="title" className="text-white">
              Login Page
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onLogin)}>
              <div className="grid w-full items-center gap-3">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Emailアドレスを入力"
                    data-testid="email"
                    {...register("email", {
                      required: "メールアドレスは必須です",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "有効なメールアドレスを入力してください",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    data-testid="password"
                    placeholder="Passwordを入力"
                    type="password"
                    {...register("password", {
                      required: "パスワードの入力は必須です",
                      minLength: {
                        value: 8,
                        message: "パスワードは8文字以上である必要があります",
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1.5  mt-6">
                <button
                  data-testid="login-button"
                  className="bg-gradient-to-b from-fuchsia-300 to-indigo-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  ログイン
                </button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col mt-4">
            <Link
              to="/newuser"
              className="w-full"
              style={{ textDecoration: "none" }}
            >
              <button
                data-testid="new-user"
                className="bg-gradient-to-b from-indigo-300 to-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                新規ユーザー登録はこちら
              </button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
export default LoginPage;
