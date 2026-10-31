import type React from 'react';
import { useCallback, useState } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import classNames from 'classnames';

import { ClipboardTextIcon } from '@phosphor-icons/react';

import { insertTemplateCompose } from '@/mastodon/actions/compose';
import { IconButton } from '@/mastodon/components/button/redesign';
import { Popover } from '@/mastodon/components/popover';
import { TemplatePicker } from '@/mastodon/features/compose/components/template_picker_dropdown';
import { useToggle } from '@/mastodon/hooks/useToggle';
import { getComposerTextarea } from '@/mastodon/reducers/slices/composer';
import { useAppDispatch } from '@/mastodon/store';

const messages = defineMessages({
  template: { id: 'template_button.label', defaultMessage: 'Insert template' },
});

interface CustomTemplate {
  content: string;
}

export const ComposeTemplateButton: React.FC = () => {
  const intl = useIntl();
  const [open, { onToggle, onFalse }] = useToggle();
  const [target, setTarget] = useState<HTMLButtonElement | null>(null);

  const dispatch = useAppDispatch();
  const handlePick = useCallback(
    (template: CustomTemplate) => {
      onFalse();

      const textarea = getComposerTextarea();
      const position = textarea?.selectionStart ?? textarea?.value.length ?? 0;
      dispatch(insertTemplateCompose(position, template.content));
    },
    [dispatch, onFalse],
  );

  return (
    <>
      <IconButton
        size='sm'
        icon={ClipboardTextIcon}
        ref={setTarget}
        onClick={onToggle}
        aria-expanded={open}
      >
        {intl.formatMessage(messages.template)}
      </IconButton>

      <Popover
        isOpen={open}
        onClose={onFalse}
        reference={target}
        placement='top-start'
        offset={4}
      >
        {({ props, placement }) => (
          <div
            {...props}
            className={classNames('dropdown-animation', placement)}
          >
            <div className='template-picker-dropdown__menu'>
              <TemplatePicker onClick={handlePick} />
            </div>
          </div>
        )}
      </Popover>
    </>
  );
};
