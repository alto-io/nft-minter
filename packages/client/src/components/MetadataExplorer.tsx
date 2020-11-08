import React, { useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import {useListMetadata} from '../utils/metadata'


import * as deployInfo from '../deployinfo.json';

function MetadataExplorer() {

  try {
  const metadata = useListMetadata();
  } catch (e) {
    console.log(e)
  }

  return (
    <>
        <h5>
            Gist Id: {deployInfo.gistId}
        </h5>
    </>
  );
}

export {MetadataExplorer};