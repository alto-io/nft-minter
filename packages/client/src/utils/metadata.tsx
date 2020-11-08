import {useQuery} from 'react-query'
import {useClient} from '../context/auth-context'

function useListMetadata({onSuccess=null, ...options} = {}) {
  const client = useClient()

  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items').then(data => data.listItems),
    onSuccess: async listItems => {
      await onSuccess?.(listItems)
      for (const listItem of listItems) {
        
      }
    },
    ...options,
  })
  return listItems ?? []
}

export {
  useListMetadata
}
