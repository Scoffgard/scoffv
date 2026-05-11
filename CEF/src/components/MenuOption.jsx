
import ArrowForwardSvg from '../assets/arrow_forward.svg?react';
import CheckboxTickedSvg from '../assets/checkbox_ticked.svg?react';
import CheckboxEmptySvg from '../assets/checkbox_empty.svg?react';
import CaretSvg from '../assets/caret.svg?react';
import ReturnSvg from '../assets/return.svg?react';

import '../styles/components/MenuOption.scss';
import { RgbColorPicker } from 'react-colorful';

export default function MenuOption(props) {

  return (
    <div className={`menuoption ${props.type || 'button'} ${props.selected ? 'selected' : ''} ${props.focus ? 'focus' : ''}`}>
      { !props.focus && props.type != 'divider' ?
        props.label
        : <></>
      }
      {(!props.type || props.type == 'button') &&
        <></>
      }
      {(props.type == 'confirm' && props.focus) &&
        <>
          <div className='confirm'>Confirm {props.label}</div>
          <span className="right">
            <ReturnSvg />
          </span>
        </>
      }
      {props.type == 'link' &&
        <span className="right">
          <ArrowForwardSvg />
        </span>
      }
      {props.type == 'checkbox' &&
        <span className="right">
          {props.value ?
            <CheckboxTickedSvg />
            :
            <CheckboxEmptySvg />
          }
        </span>
      }
      {(props.type == 'input') &&
        (props.focus ?
          <>
            {props.value || 
              <div className='placeholder'>{props.label}</div>
            }
            <span className="right">
              <ReturnSvg />
            </span>
          </>
          :
          <span className="right">
            <CaretSvg />
          </span>
        )
      }
      {props.type == 'number' &&
        <span className="right">
          <span className={`prev ${props.min == props.value && !props.allowRotation ? 'grayed' : ''}`}><ArrowForwardSvg className="mirror" /></span>
          <span className="value">{props.value}</span>
          <span className={`next ${props.max == props.value && !props.allowRotation ? 'grayed' : ''}`}><ArrowForwardSvg /></span>
        </span>
      }
      {props.type == 'option' &&
        <span className="right">
          <span className={`prev`}><ArrowForwardSvg className="mirror" /></span>
          <span className="value">{props.value}</span>
          <span className={`next`}><ArrowForwardSvg /></span>
        </span>
      }
      {(props.type == 'color') &&
        (props.focus ?
          <>
            <RgbColorPicker color={props.value} onChange={props.setValue} />
          </>
          :
          <span className="right color" style={{ backgroundColor: `rgb(${props.value.r},${props.value.g},${props.value.b})` }}>
            
          </span>
        )
      }
      {props.type == 'divider' &&
        <span className='divider-bar'></span>
      }
    </div>
  )
}