import React from 'react';

import {useGistMetadata} from '../utils/metadata';

function MetadataExplorer() {
 
  const gistMetadata = useGistMetadata()

  return (
    <>
        <h5>
            Gist URL: {gistMetadata.url ? gistMetadata.url : "Loading..." }
        </h5>

    </>
  );
}

export {MetadataExplorer};