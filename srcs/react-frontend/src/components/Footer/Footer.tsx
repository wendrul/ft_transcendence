import React from 'react';
import {
  MDBFooter,
  MDBContainer,
//  MDBCol,
//  MDBRow,
  MDBIcon
} from 'mdb-react-ui-kit';
import "./Footer.css";

export default function FooterComponent() {
  return (
    <MDBFooter className='bg-dark text-center text-white t_footer'>
      <MDBContainer className='p-4 pb-0'>
        <section className='mb-4'>
		  <a className='btn btn-outline-light btn-floating m-1' href='https://github.com/wendrul/ft_transcendence' role='button'>
            <MDBIcon fab icon='github' />
          </a>
          <a className='btn btn-outline-light btn-floating m-1' href='#!' role='button'>
            <MDBIcon fab icon='google' />
          </a>
          <a className='btn btn-outline-light btn-floating m-1' href='#!' role='button'>
            <MDBIcon fab icon='instagram' />
          </a>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2022 ft_transcendence

      </div>
    </MDBFooter>
  );
}

export {FooterComponent}