// Packages
import React from 'react';

// Components
import KTPHeader from './KTPHeader';
import KTPFooter from './KTPFooter';

function Layout(props) {
  return (
    <div>
      <KTPHeader />
      {props.children}
      <KTPFooter />
    </div>
  );
}

export default Layout;