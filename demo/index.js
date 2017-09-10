import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import {yellow800} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconClock from 'material-ui/svg-icons/device/access-time';
import TextField from 'material-ui/TextField';

import TimeField from '../';

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

  onTimeChange(value) {
    const newTime = value.replace(/-/g, ':');
    const time = newTime.substr(0, 5);
    const timeSeconds = newTime.padEnd(8, this.state.timeSeconds.substr(5, 3));
    const timeSecondsCustomColon = timeSeconds.replace(/:/g, '-');

    this.setState({time, timeSeconds, timeSecondsCustomColon});
  }

  render() {
    const {time, timeSeconds, timeSecondsCustomColon} = this.state;

    const muiTheme = getMuiTheme({
      fontFamily: 'Arial',
      palette: {
        primary1Color: yellow800
      },
      textField: {
        floatingLabelColor: '#666'
      }
    });

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
          <MuiThemeProvider muiTheme={muiTheme}>
            <div style={{marginRight: 20}}>
              <IconClock style={{width: 25, marginRight: 6, marginBottom: -6}} color="#bbb" />
              <TimeField
                showSeconds
                value={timeSeconds}
                onChange={this.onTimeChange}
                style={{width: 82, fontSize: 20}}
                input={(
                  <TextField
                    floatingLabelFixed
                    floatingLabelText="Time"
                  />
                )}
              />
            </div>
          </MuiThemeProvider>
        </section>
      </section>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
