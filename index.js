import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_VALUE = '00:00';

function isNumber(value) {
  const number = Number(value);
  return (!isNaN(number) && String(value) === String(number));
}

function validateTimeAndCursor(value, defaultValue, cursorPosition) {
  const [oldH, oldM] = defaultValue.split(':');

  let newCursorPosition = Number(cursorPosition);
  let [newH, newM] = value.split(':');

  newH = (newH || '00').padEnd(2, '0').substr(0, 2);
  newM = (newM || '00').padEnd(2, '0').substr(0, 2);

  if (Number(newH[0]) > 2) {
    newH = oldH;
    newCursorPosition -= 1;
  } else if (Number(newH[0]) === 2) {
    if (Number(oldH[0]) === 2 && Number(newH[1]) > 3) {
      newH = `2${oldH[1]}`;
      newCursorPosition -= 2;
    } else if (Number(newH[1]) > 3) {
      newH = '23';
    }
  }

  if (Number(newM[0]) > 5) {
    newM = oldM;
    newCursorPosition -= 1;
  }

  return [`${newH}:${newM}`, newCursorPosition];
}

export default class TimeField extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  constructor(...args) {
    super(...args);

    const [validatedTime] = validateTimeAndCursor(this.props.value, DEFAULT_VALUE);

    this.state = {
      value: validatedTime
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {value} = this.props;

    if (value !== nextProps.value) {
      const [validatedTime] = validateTimeAndCursor(nextProps.value, DEFAULT_VALUE);
      this.setState({
        value: validatedTime
      });
    }
  }

  //onInputChange(event, inputValue, callback) {
  onInputChange(event, callback) {
    const oldValue = this.state.value;
    const inputEl = event.target;
    const inputValue = inputEl.value;
    const position = inputEl.selectionEnd;
    const isType = (inputValue.length > oldValue.length);
    const addedCharacter = (isType ? inputValue[position - 1] : null);
    const removedCharacter = (isType ? null : oldValue[position]);

    let newValue = oldValue;
    let newPosition = position;

    if (addedCharacter !== null) {
      if (position > 5) {
        newPosition = 5;
      } else if (position === 3 && addedCharacter === ':') {
        newValue = `${inputValue.substr(0, 2)}:${inputValue.substr(3)}`;
      } else if (position === 3 && isNumber(addedCharacter)) {
        newValue = `${inputValue.substr(0, 2)}:${addedCharacter}${inputValue.substr(5)}`;
        newPosition = 4;
      } else if (isNumber(addedCharacter)) { // user typed a number
        newValue = (inputValue.substr(0, position - 1) + addedCharacter + inputValue.substr(position + 1));
        if (position === 2) {
          newPosition = 3;
        }
      } else { // if user typed NOT a number, then keep old value & position
        newPosition = (position - 1);
      }
    } else if (removedCharacter !== null) {
      if (position === 2 && removedCharacter === ':') {
        newValue = `${inputValue.substr(0, 1)}0:${inputValue.substr(2)}`;
        newPosition = 1;
      } else { // user removed a number
        newValue = `${inputValue.substr(0, position)}0${inputValue.substr(position)}`;
      }
    }

    const [validatedTime, validatedCursorPosition] = validateTimeAndCursor(newValue, oldValue, newPosition);

    this.setState({value: validatedTime}, () => {
      inputEl.selectionStart = validatedCursorPosition;
      inputEl.selectionEnd = validatedCursorPosition;
      callback(validatedTime);
    });

    event.persist();
  }

  render() {
    const {value} = this.state;
    const {onChange, style, ...props} = this.props;

    const combinedStyle = {width: 35, ...style};

    return (
      <input
        {...props}
        value={value}
        style={combinedStyle}
        onChange={(event) => this.onInputChange(event, v => onChange(v))}
      />
    );
  }
}
