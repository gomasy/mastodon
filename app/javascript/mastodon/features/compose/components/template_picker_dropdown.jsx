import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import escapeTextContentForBrowser from 'escape-html';

import { EmojiHTML } from '@/mastodon/components/emoji/html';

const messages = defineMessages({
  template: { id: 'template_button.label', defaultMessage: 'Insert template' },
});

let customTemplates = null;

export async function loadCustomTemplateData() {
  if (customTemplates !== null) {
    return customTemplates;
  }
  const url = new URL('/api/v1/custom_templates', location.origin);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch custom templates: ${response.statusText}`);
  }
  customTemplates = await response.json();
  return customTemplates;
}

export const TemplatePicker = ({ onClick }) => {
  const intl = useIntl();
  const [isLoaded, setIsLoaded] = useState(customTemplates !== null);

  useEffect(() => {
    if (customTemplates === null) {
      void loadCustomTemplateData().then(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  const handleClick = useCallback(e => {
    onClick(customTemplates[e.currentTarget.getAttribute('data-index')]);
  }, [onClick]);

  if (!isLoaded) {
    return null;
  }

  const title = intl.formatMessage(messages.template);

  return (
    <div className='template-picker'>
      <div className='template-picker-title'>{title}</div>
      <div className='template-picker-scroll'>
        <div className='template-picker-area'>
          {customTemplates.map((template, i) => {
            const html = escapeTextContentForBrowser(template.content).replace(/\s*\r\n/g, '<br />');

            return (
              <EmojiHTML
                className='template-picker-template'
                key={i}
                data-index={i}
                htmlString={html}
                extraEmojis={template.emojis}
                onClick={handleClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

TemplatePicker.propTypes = {
  onClick: PropTypes.func.isRequired,
};
