import React, { useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import * as contractRoot from '../contracts.json';


function ContractExplorer() {

  const [activeTab, setActiveTab] = useState('');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  useEffect(() => {
      setActiveTab(contractRoot.name);
  });

  return (
    <>
      <Nav tabs>
        {
          Object.keys(contractRoot).map(network => (
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === contractRoot[network].name })}
                onClick={() => { toggle(contractRoot[network].name); }}>
                Network: {contractRoot[network].name}
              </NavLink>
            </NavItem>
            )
          )
      }
    </Nav>

    <TabContent activeTab={activeTab}>
        <TabPane tabId={activeTab}>
          {
            Object.keys(contractRoot.contracts).map(contract => (
              <>
                <h5>{contract}</h5>
                <h6>{contractRoot.contracts[contract].address}</h6>
              </>
              )
            )
          }
        </TabPane>
      </TabContent>
    </>
  );
}

export {ContractExplorer};