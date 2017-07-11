// @flow

import React from 'react';

type LayoutProps = {
    children: React.Element<*>
};

const Layout = (props: LayoutProps) => (
    <div>
        {props.children}
    </div>
);

export default Layout;