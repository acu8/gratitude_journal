import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <Link to="/login" className="link link-hover">
        Login Page
      </Link>
      <br />
    </div>
  );
}

export default Home;
