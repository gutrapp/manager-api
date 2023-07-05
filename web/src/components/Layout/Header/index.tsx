import { AiOutlineUser } from "react-icons/ai";
import { User } from "../../../types/user";
import "./index.css";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [user, setUser] = useState<User>();

  return (
    <main className="header">
      <h2 className="logo">{"</project-manager>"}</h2>
      <div className="header__corner">
        <div className="search">
          <input className="search__input" placeholder="Search..." />
        </div>

        <div className="user">
          {/* {!user.is_active && (
            <div>
              <Link to={"/login"}>
                <button className="login">Login</button>
              </Link>
            </div>
          )}
          {user.is_active && <AiOutlineUser size={28} />} */}
        </div>
      </div>
    </main>
  );
};
