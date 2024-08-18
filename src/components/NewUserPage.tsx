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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addUserRecords } from "../utils/supabaseFunction";

type FormData = {
  name: string;
  email: string;
  password: string;
};

function NewUserPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await addUserRecords(data.name, data.email, data.password);
      reset();
      navigate("/login");
      console.log("ユーザー登録成功:", data);
    } catch (error) {
      console.error("ユーザー登録エラー:", error);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle data-testid="title">新規ユーザー登録</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Name</Label>
              <Input
                id="name"
                data-testid="name"
                placeholder="フルネームを入力"
                {...register("name", { required: "名前の入力は必須です" })}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input
                id="email"
                data-testid="email"
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
              <Label htmlFor="framework">Password</Label>
              <Input
                id="password"
                data-testid="password"
                placeholder="Passwordを入力"
                type="password"
                {...register("password", {
                  required: "パスワードは必須です",
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

          <CardFooter className="flex justify-end mt-4">
            <button
              data-testid="submit"
              type="submit"
              className="btn btn-success"
            >
              新規ユーザー登録
            </button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
export default NewUserPage;
