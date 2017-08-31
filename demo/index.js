import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import TimeField from '../';

class App extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      time: '12:34',
      timeSeconds: '12:34:56'
    };

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  onTimeChange(newTime) {
    const time = newTime.substr(0, 5);
    const timeSeconds = newTime.padEnd(8, this.state.timeSeconds.substr(5, 3));

    this.setState({time, timeSeconds});
  }

  render() {
    const {time, timeSeconds} = this.state;

    return (
      <section className="container">
        <h2>Default input:</h2>
        <section>
          <TimeField value={time} onChange={this.onTimeChange} />
        </section>
        <h2>Styled default input:</h2>
        <section>
          <TimeField
            value={time}
            onChange={this.onTimeChange}
            style={{
              border: '2px solid #666',
              fontSize: 42,
              width: 107,
              padding: '5px 8px',
              color: '#333',
              borderRadius: 3
            }}
          />
        </section>
        <h2>Show seconds:</h2>
        <section>
          <TimeField
            showSeconds
            value={timeSeconds}
            onChange={this.onTimeChange}
            style={{
              border: '2px solid #666',
              fontSize: 42,
              width: 167,
              padding: '5px 8px',
              color: '#333',
              borderRadius: 3
            }}
          />
        </section>
      </section>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
