import { useMemo } from 'react';
import type { FC } from 'react';

import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import { FormattedDateWrapper } from '@/mastodon/components/formatted_date';
import { useAccount } from '@/mastodon/hooks/useAccount';

import { isRedesignEnabled } from '../common';

import classes from './redesign.module.scss';

const LegacyNumberFields: FC<{ accountId: string }> = ({ accountId }) => {
  const intl = useIntl();
  const account = useAccount(accountId);

  if (!account) {
    return null;
  }

  return (
    <div className='account__header__extra__links'>
      <NavLink
        to={`/@${account.acct}`}
        title={intl.formatNumber(account.statuses_count)}
      >
        <strong><FormattedNumber value={account.statuses_count} /></strong> <FormattedMessage id='account.posts' defaultMessage='Toots' />
      </NavLink>

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
    </div>
  );
};

const RedesignNumberFields: FC<{ accountId: string }> = ({ accountId }) => {
  const intl = useIntl();
  const account = useAccount(accountId);
  const createdThisYear = useMemo(
    () => account?.created_at.includes(new Date().getFullYear().toString()),
    [account?.created_at],
  );

  if (!account) {
    return null;
  }

  return (
    <ul
      className={classNames(
        'account__header__extra__links',
        classes.fieldNumbersWrapper,
      )}
    >
      <li>
        <FormattedMessage id='account.posts' defaultMessage='Posts' />
        <strong>
          <FormattedNumber value={account.statuses_count} />
        </strong>
      </li>

      <li>
        <NavLink
          exact
          to={`/@${account.acct}/followers`}
          title={intl.formatNumber(account.followers_count)}
        >
          <FormattedMessage id='account.followers' defaultMessage='Followers' />
          <strong>
            <FormattedNumber value={account.followers_count} />
          </strong>
        </NavLink>
      </li>

      <li>
        <NavLink
          exact
          to={`/@${account.acct}/following`}
          title={intl.formatNumber(account.following_count)}
        >
          <FormattedMessage id='account.following' defaultMessage='Following' />
          <strong>
            <FormattedNumber value={account.following_count} />
          </strong>
        </NavLink>
      </li>

      <li>
        <FormattedMessage id='account.joined_short' defaultMessage='Joined' />
        <strong>
          {createdThisYear ? (
            <FormattedDateWrapper
              value={account.created_at}
              month='short'
              day='2-digit'
            />
          ) : (
            <FormattedDateWrapper value={account.created_at} year='numeric' />
          )}
        </strong>
      </li>
    </ul>
  );
};

export const AccountNumberFields = isRedesignEnabled()
  ? RedesignNumberFields
  : LegacyNumberFields;
