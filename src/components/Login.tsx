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
        setTimeout(() => navigate("/journal"), 0);
      } else {
        console.error("ログインに失敗しました: ユーザーが見つかりません");
      }
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login Page</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onLogin)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Emailアドレスを入力"
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
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-outline btn-success cursor: cursor-pointer">
              Login
            </button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between mt-4">
        <Link to="/newuser" className="" style={{ textDecoration: "none" }}>
          <button className="btn btn-warning">新規ユーザー登録はこちら</button>
        </Link>
      </CardFooter>
    </Card>
  );
}
export default LoginPage;
