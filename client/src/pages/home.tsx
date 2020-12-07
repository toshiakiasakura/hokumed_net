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
          <h1 className="hero__welcome__title">北医ネット(作成中) </h1>
          <div className="hero__welcome__elocution">
            <h3> お知らせ </h3>
            <table>
              <tr>
                <th> aaaa </th>
                <td> aaaa </td>
              </tr>
            </table>
          </div>
        </div>
        <h2> テスト </h2>
        <form name="login-form"> <br/>
          <input type="email" name="email" /><br/>
          <input type="password" name="password" />
        </form>
      </div>
    </div>
  );
}

export default Home
