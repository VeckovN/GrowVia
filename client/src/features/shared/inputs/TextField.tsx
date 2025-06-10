import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { TextFieldPropsInterface } from '../interfaces';

{/* Input will have forwardRef that allows 'parent' component to get ref from <input> (this one) */}
{/* For example if we use inputRef.current?.focus  'parrent' component(that use this component) - it won't work without forwardRef */}

const TextField: ForwardRefExoticComponent<Omit<TextFieldPropsInterface, 'ref'> & RefAttributes<HTMLInputElement>> = forwardRef((props, ref) => (
    <>
        <input
            className={props.className}
            ref={ref}
            id={props.id}
            name={props.name}
            type={props.type}
            value={props.value}
            readOnly={props.readOnly}
            checked={props.checked}
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            onChange={props.onChange}
            onClick={props.onClick}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            autoComplete="false"
        />
  </>
));

export default TextField;