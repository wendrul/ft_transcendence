import React from 'react';
import PropTypes from 'prop-types';



const icons = {
	trash: 'M192 1024h640l64-704h-768zM640 128v-128h-256v128h-320v192l64-64h768l64 64v-192h-320zM576 128h-128v-64h128v64z',
  facebook: 'M608 192h160v-192h-160c-123.514 0-224 100.486-224 224v96h-128v192h128v512h192v-512h160l32-192h-192v-96c0-17.346 14.654-32 32-32z',
};

const Icon = (props: typeof icons) => (
	<svg width="22" height="22" viewBox="0 0 1024 1024">
    {/* <path d={icons[props.icon]}></path> */}
  </svg>
);

Icon.propTypes = {
	icon: PropTypes.string.isRequired,
};
 
export default Icon;