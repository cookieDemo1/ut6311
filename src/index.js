import './style';
import { h, Component } from 'preact';
import Home from './layout';


class App extends Component {
  render() {
    return (
        <div id="app">
          <Home />
        </div>
    );
  }
}



export default App;
