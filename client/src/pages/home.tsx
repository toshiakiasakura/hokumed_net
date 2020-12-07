import React from 'react'
import '../style/_home.sass';
import NavBar from '../components/nav_bar'

function Home() {
  return (
    <div>
      <NavBar />
      <div className="hero">
        <div className="hero__bg" />
        <div className="hero__welcome">
          <div className="hero__welcome__title">北医ネット<br/>(作成中) </div>
          <div className="hero__welcome__elocution">
           {/*TO DO: Connect with backend and display notification. */}
            <h3> お知らせ </h3>
            <table>
              <tr>
                <th> aaaa </th>
                <td> aaaa </td>
              </tr>
            </table>
          </div>
          <h2> テスト </h2>
          <form name="login-form"> <br/>
            <input type="email" name="email" /><br/>
            <input type="password" name="password" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home
