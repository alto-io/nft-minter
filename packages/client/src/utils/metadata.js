import {useQuery} from 'react-query'
import {useClient} from '../context/auth-context'

// import * as deployInfo from '../deployinfo.json';

import config from '../config';

const metadataQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

function useGistMetadata({onSuccess, ...options} = {}) {
  const client = useClient()

  const {data: listItems} = useQuery({
    queryKey: 'metadata',
    queryFn: () => client(`gists/${config.gistId}`).then(data => data),
    onSuccess: async listItems => {
      await onSuccess?.(listItems)
      for (const listItem of listItems) {
          console.log(listItem)
      }
    },
    ...options,
  })
  return listItems ?? []
}

export {
  useGistMetadata
}
