# react-simple-timefield

Simple React time input field, check out [demo](https://antonfisher.com/react-simple-timefield/).

[![Build Status](https://travis-ci.org/antonfisher/react-simple-timefield.svg?branch=master)](https://travis-ci.org/antonfisher/react-simple-timefield)
[![Coverage Status](https://coveralls.io/repos/github/antonfisher/react-simple-timefield/badge.svg?branch=master)](https://coveralls.io/github/antonfisher/react-simple-timefield?branch=master)
[![npm](https://img.shields.io/npm/v/react-simple-timefield.svg?colorB=brightgreen)](https://www.npmjs.com/package/react-simple-timefield)

[![Demo](docs/demo.gif)](https://antonfisher.com/react-simple-timefield/)

## Installation
```bash
npm install --save react-simple-timefield
```

## Usage
```jsx
import TimeField from 'react-simple-timefield';
...
<TimeField
    value={time}                   // {String}   required, format '00:00' or '00:00:00'
    onChange={(value) => {...}}    // {Function} required
    input={<MyCustomInputElement>} // {Element}  default: <input>
    colon=":"                      // {String}   default: ":"
    showSeconds                    // {Boolean}  default: false
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
* 1.3.0 Added custom colon property
* 1.2.0 Added custom input field property
* 1.1.0 Added `showSeconds` property
* 1.0.0 Initial release

## Contributing
```bash
# run development mode
cd demo
npm run dev

# run demo build
cd demo
npm run build

# run main build
npm run build

# run lint
npm run lint
```

## Todo
- [x] Support full time format with seconds
- [x] Tests
- [x] Custom input field (like Material UI TextField)
- [x] Custom colon
- [ ] Support for Date object as value

## License
MIT License. Free use and change. 