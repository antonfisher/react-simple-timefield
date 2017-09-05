import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_VALUE_SHORT = '00:00';
const DEFAULT_VALUE_FULL = '00:00:00';

export function isNumber(value) {
  const number = Number(value);
  return (!isNaN(number) && String(value) === String(number));
}

export function formatTimeItem(value) {
  return (`${value || ''}00`).substr(0, 2);
}

export function validateTimeAndCursor(showSeconds, value, defaultValue, cursorPosition) {
  const [oldH, oldM, oldS] = defaultValue.split(':');

  let newCursorPosition = Number(cursorPosition);
  let [newH, newM, newS] = value.split(':');

  newH = formatTimeItem(newH);
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

  newM = formatTimeItem(newM);
  if (Number(newM[0]) > 5) {
    newM = oldM;
    newCursorPosition -= 1;
  }

  if (showSeconds) {
    newS = formatTimeItem(newS);
    if (Number(newS[0]) > 5) {
      newS = oldS;
      newCursorPosition -= 1;
    }
  }

  const validatedValue = (showSeconds ? `${newH}:${newM}:${newS}` : `${newH}:${newM}`);

  return [validatedValue, newCursorPosition];
}

export default class TimeField extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    showSeconds: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    showSeconds: false,
    style: {}
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.configure(props);

    const [validatedTime] = validateTimeAndCursor(this._showSeconds, this.props.value, this._defaultValue);

    this.state = {
      value: validatedTime
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {value} = this.props;

    this.configure(nextProps);

    if (value !== nextProps.value) {
      const [validatedTime] = validateTimeAndCursor(this._showSeconds, nextProps.value, this._defaultValue);
      this.setState({
        value: validatedTime
      });
    }
  }

  configure(props) {
    this._showSeconds = Boolean(props.showSeconds);
    this._defaultValue = (this._showSeconds ? DEFAULT_VALUE_FULL : DEFAULT_VALUE_SHORT);
    this._maxLength = this._defaultValue.length;
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
      if (position > this._maxLength) {
        newPosition = this._maxLength;
      } else if ((position === 3 || position === 6) && addedCharacter === ':') {
        newValue = `${inputValue.substr(0, position - 1)}:${inputValue.substr(position + 1)}`;
      } else if ((position === 3 || position === 6) && isNumber(addedCharacter)) {
        newValue = `${inputValue.substr(0, position - 1)}:${addedCharacter}${inputValue.substr(position + 2)}`;
        newPosition = (position + 1);
      } else if (isNumber(addedCharacter)) { // user typed a number
        newValue = (inputValue.substr(0, position - 1) + addedCharacter + inputValue.substr(position + 1));
        if (position === 2 || position === 5) {
          newPosition = (position + 1);
        }
      } else { // if user typed NOT a number, then keep old value & position
        newPosition = (position - 1);
      }
    } else if (removedCharacter !== null) {
      if ((position === 2 || position === 5) && removedCharacter === ':') {
        newValue = `${inputValue.substr(0, position - 1)}0:${inputValue.substr(position)}`;
        newPosition = position - 1;
      } else { // user removed a number
        newValue = `${inputValue.substr(0, position)}0${inputValue.substr(position)}`;
      }
    }

    const [
      validatedTime,
      validatedCursorPosition
    ] = validateTimeAndCursor(this._showSeconds, newValue, oldValue, newPosition);

    this.setState({value: validatedTime}, () => {
      inputEl.selectionStart = validatedCursorPosition;
      inputEl.selectionEnd = validatedCursorPosition;
      callback(validatedTime);
    });

    event.persist();
  }

  render() {
    const {value} = this.state;
    const {onChange, style, showSeconds, ...props} = this.props;
    const combinedStyle = {width: (showSeconds ? 54 : 35), ...style};

    return (
      <input
        {...props}
        value={value}
        style={combinedStyle}
        onChange={(event) => this.onInputChange(event, (v) => onChange(v))}
      />
    );
  }
}
