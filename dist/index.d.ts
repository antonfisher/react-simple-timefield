import React, { ChangeEvent, CSSProperties, ReactElement } from 'react';
export declare function isNumber<T>(value: T): boolean;
export declare function formatTimeItem(value?: string | number, len?: number): string;
export declare function validateTimeAndCursor(showSeconds?: boolean, value?: string, defaultValue?: string, colon?: string, cursorPosition?: number, disableHoursLimit?: boolean, maxHoursLength?: number): [string, number];
declare type onChangeType = (event: ChangeEvent<HTMLInputElement>, value: string) => void;
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
    private numberPositions;
    private colonPositions;
    static defaultProps: Props;
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    onInputChange(event: ChangeEvent<HTMLInputElement>, callback: onChangeType): void;
    render(): ReactElement;
}
export {};
