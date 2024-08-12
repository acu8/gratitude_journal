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

function LoginPage() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login Page</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Emailアドレスを入力" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Password</Label>
              <Input id="name" placeholder="Passwordを入力" />
            </div>
          </div>
        </form>
      </CardContent>
      <div className="flex justify-end">
        <Link to="/journal" className="" style={{ textDecoration: "none" }}>
          <button className="btn btn-outline btn-success cursor: cursor-pointer">
            Login
          </button>
        </Link>
      </div>
      <CardFooter className="flex justify-between mt-4">
        <Link to="/newuser" className="" style={{ textDecoration: "none" }}>
          <button className="btn btn-warning">新規ユーザー登録はこちら</button>
        </Link>
      </CardFooter>
    </Card>
  );
}
export default LoginPage;
