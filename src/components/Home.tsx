import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <Link to="/login" className="link link-hover">
        Login Page
      </Link>
      <br />
      <Link to="/journal" className="link link-hover">
        Journal Page
      </Link>
      <br />
      <Link to="/calendar" className="link link-hover">
        Calendar Page
      </Link>
    </div>
  );
}

export default Home;
