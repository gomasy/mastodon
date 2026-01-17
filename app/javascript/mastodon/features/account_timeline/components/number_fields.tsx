import type { FC } from 'react';

import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import { FormattedDateWrapper } from '@/mastodon/components/formatted_date';
import { useAccount } from '@/mastodon/hooks/useAccount';

import { isRedesignEnabled } from '../common';

import classes from './redesign.module.scss';

export const AccountNumberFields: FC<{ accountId: string }> = ({
  accountId,
}) => {
  const intl = useIntl();
  const account = useAccount(accountId);

  if (!account) {
    return null;
  }

  return (
    <div
      className={classNames(
        'account__header__extra__links',
        isRedesignEnabled() && classes.fieldNumbersWrapper,
      )}
    >
      {!isRedesignEnabled() && (
        <NavLink
          to={`/@${account.acct}`}
          title={intl.formatNumber(account.statuses_count)}
        >
          <strong><FormattedNumber value={account.statuses_count} /></strong> <FormattedMessage id='account.posts' defaultMessage='Toots' />
        </NavLink>
      )}

      <NavLink
        exact
        to={`/@${account.acct}/following`}
        title={intl.formatNumber(account.following_count)}
      >
        <strong><FormattedNumber value={account.following_count} /></strong> <FormattedMessage id='account.follow' defaultMessage='Follow' />
      </NavLink>

      <NavLink
        exact
        to={`/@${account.acct}/followers`}
        title={intl.formatNumber(account.followers_count)}
      >
        <strong><FormattedNumber value={account.followers_count} /></strong> <FormattedMessage id='account.followers' defaultMessage='Followers' />
      </NavLink>

      {isRedesignEnabled() && (
        <NavLink exact to={`/@${account.acct}`}>
          <FormattedMessage
            id='account.joined_long'
            defaultMessage='Joined on {date}'
            values={{
              date: (
                <strong>
                  <FormattedDateWrapper
                    value={account.created_at}
                    year='numeric'
                    month='short'
                    day='2-digit'
                  />
                </strong>
              ),
            }}
          />
        </NavLink>
      )}
    </div>
  );
};
