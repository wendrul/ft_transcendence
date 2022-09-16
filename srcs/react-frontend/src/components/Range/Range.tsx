import React from 'react';
import { MDBRange } from 'mdb-react-ui-kit';

export default function RangeComponent() {
  return (
    <MDBRange
      defaultValue={5}
      min='1'
      max='10'
      step='1'
      id='customRange3'
      label='Score'
      labelClass='text-center w-100'
    />
  );
}

export {RangeComponent}