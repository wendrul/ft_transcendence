import { Link } from "react-router-dom";

import classes from "./MainNavigation.module.css"

export default function MainNavigation(props: any) {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>FT_Transcendence</div>
        <nav>
          <ul>
            <li>
               <Link to="/">root</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/game-test">game-test</Link>
            </li>
            <li>
              <Link to="/game">game</Link>
            </li>
          </ul>
        </nav>
    </header>
  );
}
