import React from 'react';

import {useGistMetadata} from '../utils/metadata';

import * as deployInfo from '../deployinfo.json';

function MetadataExplorer() {
 
  const gistMetadata = useGistMetadata()

  return (
    <>
        <h5>
            Gist Id: {deployInfo.gistId}
        </h5>
        <h5>
            Gist URL: {gistMetadata.url}
        </h5>

    </>
  );
}

export {MetadataExplorer};