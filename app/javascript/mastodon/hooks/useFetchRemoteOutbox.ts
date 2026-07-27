import { useCallback, useContext } from 'react';

import { useParams } from 'react-router';

import { fetchRemoteOutbox } from '@/mastodon/actions/accounts';
import { expandTimelineByParams } from '@/mastodon/actions/timelines_typed';
import { AccountTimelineContext } from '@/mastodon/features/account_timeline/hooks/useAccountContext';
import { useAppDispatch } from '@/mastodon/store';

// Reloads the very timeline the account column is currently showing, so that
// the posts pulled in from the remote outbox actually show up. Outside of the
// account timeline the filter context is missing, so fall back to the same
// defaults `useAccountContextValue` uses.
export function useFetchRemoteOutbox(accountId?: string) {
  const dispatch = useAppDispatch();
  const { tagged } = useParams<{ tagged?: string }>();
  const filters = useContext(AccountTimelineContext);

  return useCallback(() => {
    if (!accountId) {
      return;
    }

    dispatch(
      fetchRemoteOutbox(accountId, () => {
        dispatch(
          expandTimelineByParams({
            type: 'account',
            userId: accountId,
            tagged,
            boosts: filters?.boosts ?? true,
            replies: filters?.replies ?? false,
          }),
        );
      }),
    );
  }, [accountId, dispatch, filters, tagged]);
}
