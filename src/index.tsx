import React, {ChangeEvent, CSSProperties, ReactElement} from 'react';

const DEFAULT_COLON = ':';
const DEFAULT_VALUE_SHORT = `00${DEFAULT_COLON}00`;
const DEFAULT_VALUE_FULL = `00${DEFAULT_COLON}00${DEFAULT_COLON}00`;
const DEFAULT_VALUE_HOURS_LEN = (len = 2): string => `${'0'.repeat(len)}${DEFAULT_COLON}00${DEFAULT_COLON}00`;
const DEFAULT_HOURS_LENGTH = 2;
const DEFAULT_COLON_POSITIONS = [3, 6];
const DEFAULT_NUMBER_POSITIONS = [2, 5];

export function isNumber<T>(value: T): boolean {
  const number = Number(value);
  return !isNaN(number) && String(value) === String(number);
}

export function formatTimeItem(value?: string | number, len = DEFAULT_HOURS_LENGTH): string {
  const zeros = '0'.repeat(len);
  return `${value || ''}${zeros}`.substr(0, len);
}

export function validateTimeAndCursor(
  showSeconds = false,
  value = '',
  defaultValue = '',
  colon = DEFAULT_COLON,
  cursorPosition = 0,
  disableHoursLimit = false,
  maxHoursLength = DEFAULT_HOURS_LENGTH
): [string, number] {
  const [oldH, oldM, oldS] = defaultValue.split(colon);

  let newCursorPosition = Number(cursorPosition);
  let [newH, newM, newS] = String(value).split(colon);

  newH = formatTimeItem(newH, maxHoursLength);
  if (!disableHoursLimit) {
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

  const validatedValue = showSeconds ? `${newH}${colon}${newM}${colon}${newS}` : `${newH}${colon}${newM}`;

  return [validatedValue, newCursorPosition];
}

type onChangeType = (event: ChangeEvent<HTMLInputElement>, value: string) => void;

interface Props {
  value?: string;
  onChange?: onChangeType;
  showSeconds?: boolean;
  input: ReactElement | null;
  inputRef?: () => HTMLInputElement | null;
  colon?: string;
  style?: CSSProperties | {};
  disableHoursLimit?: boolean;
  maxHoursLength?: number;
}

interface State {
  value: string;
  _colon: string;
  _defaultValue: string;
  _showSeconds: boolean;
  _maxLength: number;
  _disableHoursLimit: boolean;
  _maxHoursLength: number;
}

export default class TimeField extends React.Component<Props, State> {
  private numberPositions: number[];
  private colonPositions: number[];

  static defaultProps: Props = {
    showSeconds: false,
    input: null,
    style: {},
    colon: DEFAULT_COLON,
    disableHoursLimit: false,
    maxHoursLength: DEFAULT_HOURS_LENGTH
  };

  constructor(props: Props) {
    super(props);

    const _showSeconds = Boolean(props.showSeconds);
    const _colon = props.colon && props.colon.length === 1 ? props.colon : DEFAULT_COLON;
    const _disableHoursLimit = Boolean(props.disableHoursLimit);
    const _maxHoursLength =
      _disableHoursLimit && Number(props.maxHoursLength) > DEFAULT_HOURS_LENGTH
        ? Number(props.maxHoursLength)
        : DEFAULT_HOURS_LENGTH;
    const _defaultValue = _showSeconds
      ? _maxHoursLength > 2
        ? DEFAULT_VALUE_HOURS_LEN(_maxHoursLength)
        : DEFAULT_VALUE_FULL
      : DEFAULT_VALUE_SHORT;

    const [validatedTime] = validateTimeAndCursor(
      _showSeconds,
      this.props.value,
      _defaultValue,
      _colon,
      0,
      _disableHoursLimit,
      _maxHoursLength
    );

    this.state = {
      value: validatedTime,
      _colon,
      _showSeconds,
      _defaultValue,
      _maxLength: _defaultValue.length,
      _disableHoursLimit,
      _maxHoursLength
    };

    if (_disableHoursLimit && _maxHoursLength > DEFAULT_HOURS_LENGTH) {
      const shift = _maxHoursLength - DEFAULT_HOURS_LENGTH;
      this.colonPositions = DEFAULT_COLON_POSITIONS.map((pos) => pos + shift);
      this.numberPositions = DEFAULT_NUMBER_POSITIONS.map((pos) => pos + shift);
    } else {
      this.colonPositions = DEFAULT_COLON_POSITIONS;
      this.numberPositions = DEFAULT_NUMBER_POSITIONS;
    }

    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidUpdate(prevProps: Props): void {
    if (this.props.value !== prevProps.value) {
      const [validatedTime] = validateTimeAndCursor(
        this.state._showSeconds,
        this.props.value,
        this.state._defaultValue,
        this.state._colon,
        0,
        this.state._disableHoursLimit,
        this.state._maxHoursLength
      );
      this.setState({
        value: validatedTime
      });
    }
  }

  onInputChange(event: ChangeEvent<HTMLInputElement>, callback: onChangeType): void {
    const oldValue = this.state.value;
    const inputEl = event.target;
    const inputValue = inputEl.value;
    const position = inputEl.selectionEnd || 0;
    const isTyped = inputValue.length > oldValue.length;
    const cursorCharacter = inputValue[position - 1];
    const addedCharacter = isTyped ? cursorCharacter : null;
    const removedCharacter = isTyped ? null : oldValue[position];
    const replacedSingleCharacter = inputValue.length === oldValue.length ? oldValue[position - 1] : null;
    const colon = this.state._colon;

    let newValue = oldValue;
    let newPosition = position;

    if (addedCharacter !== null) {
      if (position > this.state._maxLength) {
        newPosition = this.state._maxLength;
      } else if (this.colonPositions.includes(position) && addedCharacter === colon) {
        newValue = `${inputValue.substr(0, position - 1)}${colon}${inputValue.substr(position + 1)}`;
      } else if (this.colonPositions.includes(position) && isNumber(addedCharacter)) {
        newValue = `${inputValue.substr(0, position - 1)}${colon}${addedCharacter}${inputValue.substr(position + 2)}`;
        newPosition = position + 1;
      } else if (isNumber(addedCharacter)) {
        // user typed a number
        newValue = inputValue.substr(0, position - 1) + addedCharacter + inputValue.substr(position + 1);
        if (this.numberPositions.includes(position)) {
          newPosition = position + 1;
        }
      } else {
        // if user typed NOT a number, then keep old value & position
        newPosition = position - 1;
      }
    } else if (replacedSingleCharacter !== null) {
      // user replaced only a single character
      if (isNumber(cursorCharacter)) {
        if (this.numberPositions.includes(position - 1)) {
          newValue = `${inputValue.substr(0, position - 1)}${colon}${inputValue.substr(position)}`;
        } else {
          newValue = inputValue;
        }
      } else {
        // user replaced a number on some non-number character
        newValue = oldValue;
        newPosition = position - 1;
      }
    } else if (typeof cursorCharacter !== 'undefined' && cursorCharacter !== colon && !isNumber(cursorCharacter)) {
      // set of characters replaced by non-number
      newValue = oldValue;
      newPosition = position - 1;
    } else if (removedCharacter !== null) {
      if (this.numberPositions.includes(position) && removedCharacter === colon) {
        newValue = `${inputValue.substr(0, position - 1)}0${colon}${inputValue.substr(position)}`;
        newPosition = position - 1;
      } else {
        // user removed a number
        newValue = `${inputValue.substr(0, position)}0${inputValue.substr(position)}`;
      }
    }

    const [validatedTime, validatedCursorPosition] = validateTimeAndCursor(
      this.state._showSeconds,
      newValue,
      oldValue,
      colon,
      newPosition,
      this.state._disableHoursLimit,
      this.state._maxHoursLength
    );

    this.setState({value: validatedTime}, () => {
      inputEl.selectionStart = validatedCursorPosition;
      inputEl.selectionEnd = validatedCursorPosition;
      callback(event, validatedTime);
    });

    event.persist();
  }

  render(): ReactElement {
    const {value} = this.state;
    const {onChange, style, showSeconds, input, inputRef, colon, ...props} = this.props; //eslint-disable-line no-unused-vars
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
      this.onInputChange(event, (e: ChangeEvent<HTMLInputElement>, v: string) => onChange && onChange(e, v));

    if (input) {
      return React.cloneElement(input, {
        ...props,
        value,
        style,
        onChange: onChangeHandler
      });
    }

    return (
      <input
        type="text"
        {...props}
        ref={inputRef}
        value={value}
        onChange={onChangeHandler}
        style={{width: showSeconds ? 54 : 35, ...style}}
      />
    );
  }
}
