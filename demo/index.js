import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';

import TimeField from '../';
//import TimeField from '../src';

class App extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      time: '12:34',
      timeSeconds: '12:34:56',
      timeSecondsCustomColon: '12-34-56'
    };

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  onTimeChange(event, value) {
    const newTime = value.replace(/-/g, ':');
    const time = newTime.substr(0, 5);
    const timeSeconds = newTime.padEnd(8, this.state.timeSeconds.substr(5, 3));
    const timeSecondsCustomColon = timeSeconds.replace(/:/g, '-');

    this.setState({time, timeSeconds, timeSecondsCustomColon});
  }

  render() {
    const {time, timeSeconds, timeSecondsCustomColon} = this.state;

    return (
      <section className="container">
        <h2>Default input:</h2>
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
        <h2>Custom colon:</h2>
        <section>
          <TimeField
            showSeconds
            colon="-"
            value={timeSecondsCustomColon}
            onChange={this.onTimeChange}
            style={{
              border: '2px solid #666',
              fontSize: 42,
              width: 170,
              padding: '5px 8px',
              color: '#333',
              borderRadius: 3
            }}
          />
        </section>
        <h2>React Material-UI:</h2>
        <section>
          <div style={{marginRight: 20}}>
            <TimeField
              showSeconds
              value={timeSeconds}
              onChange={this.onTimeChange}
              style={{width: 88}}
              input={<TextField label="Name" value={timeSeconds} variant="outlined" />}
            />
          </div>
        </section>
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
