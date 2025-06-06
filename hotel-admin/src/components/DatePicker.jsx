// src/components/DatePicker.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DatePicker = ({ ranges, onChange }) => {
  const [state, setState] = useState(ranges);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeChange = (item) => {
    setState([item.selection]);
    if (onChange) onChange(item);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Form.Control
        type="text"
        readOnly
        value={
          state[0].startDate && state[0].endDate
            ? `${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`
            : ''
        }
        onClick={() => setShowPicker(!showPicker)}
        style={{ cursor: 'pointer', padding: '8px', width: '250px' }}
      />
      {showPicker && (
        <div
          ref={pickerRef}
          style={{
            position: 'absolute',
            top: '45px',
            zIndex: 9999,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          <DateRange
            ranges={state}
            onChange={handleRangeChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
