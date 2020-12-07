import React from 'react'
import '../style/_home.sass';
import NavBar from '../components/nav_bar'


class Home extends React.Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    })
    const body = await response.text();
    this.setState({ responseToPost: body })
  }

  render () {
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
            <button onClick={() => this.componentDidMount() } >Get method! </button>
            <p> {this.state.response}</p>
            <form name="login-form" onSubmit={this.handleSubmit}> <br/>
              <input type="text" value={this.state.post} onChange={e =>this.setState({post: e.target.value})} /><br/>
              <button type="submit"> Submit!!! </button>
            </form>
            <p> {this.state.responseToPost}</p>
          </div>
        </div>
      </div>
  )}
}


export default Home
