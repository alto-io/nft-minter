import React from 'react'

import {useAuth} from './context/auth-context'

import {ContractExplorer} from './components/ContractExplorer'
// import {MetadataExplorer} from './components/MetadataExplorer'

function App() {

  const {user} = useAuth()

  return (
    <>
      <ContractExplorer/>
      {
      // <MetadataExplorer/>
      }
    </>
  )
}

export {App}
