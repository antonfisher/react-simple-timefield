# react-simple-timefield

Simple React time input field, check out [demo](https://antonfisher.com/react-simple-timefield/).

[![Build Status](https://travis-ci.org/antonfisher/react-simple-timefield.svg?branch=master)](https://travis-ci.org/antonfisher/react-simple-timefield)
[![Coverage Status](https://coveralls.io/repos/github/antonfisher/react-simple-timefield/badge.svg?branch=master)](https://coveralls.io/github/antonfisher/react-simple-timefield?branch=master)
[![npm](https://img.shields.io/npm/dt/react-simple-timefield.svg?colorB=brightgreen)](https://www.npmjs.com/package/react-simple-timefield)
[![npm](https://img.shields.io/npm/v/react-simple-timefield.svg?colorB=brightgreen)](https://www.npmjs.com/package/react-simple-timefield)
[![GitHub license](https://img.shields.io/github/license/antonfisher/react-simple-timefield.svg)](https://github.com/antonfisher/react-simple-timefield/blob/master/LICENSE)

[![Demo](docs/demo.gif)](https://antonfisher.com/react-simple-timefield/)

## Installation
```bash
npm install --save react-simple-timefield

#for React <16 use: npm install --save react-simple-timefield@1
```

## Usage
```jsx
import TimeField from 'react-simple-timefield';
...
<TimeField
    value={time}                     // {String}   required, format '00:00' or '00:00:00'
    onChange={(value) => {...}}      // {Function} required
    input={<MyCustomInputElement />} // {Element}  default: <input type="text" />
    colon=":"                        // {String}   default: ":"
    showSeconds                      // {Boolean}  default: false
/>
```

## Real world example
```jsx
import TimeField from 'react-simple-timefield';

class App extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      time: '12:34'
    };

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  onTimeChange(time) {
    this.setState({time});
  }

  render() {
    const {time} = this.state;

    return (
      <TimeField value={time} onChange={this.onTimeChange} />
    );
  }
}
```

## Changelog
* 2.0.3 user can type letter when component first loads (closes [#9](https://github.com/antonfisher/react-simple-timefield/issues/9)) ([8f51c70](https://github.com/antonfisher/react-simple-timefield/commit/8f51c70))
* 2.0.1 Do not fall if `value`/`onChange` is undefined (part of issue [#8](https://github.com/antonfisher/react-simple-timefield/issues/8))
* 2.0.0 React v16 support
* 1.3.0 Added custom colon property
* 1.2.0 Added custom input field property
* 1.1.0 Added `showSeconds` property
* 1.0.0 Initial release

## Contributing

#### Run demo:
For running demo locally, replace:
```javascript
import TimeField from '../';
// to
import TimeField from '../src';
```
in `demo/index.js` file.

```bash
# run development mode
cd demo
npm run dev
```

#### Build:
```bash
npm test
npm run format
npm run build
```

## License
MIT License. Free use and change.
