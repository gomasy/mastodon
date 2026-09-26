export interface AccountSuggestion {
  type: 'account';
  id: string;
}
export interface EmojiSuggestion {
  type: 'emoji';
  id: string;
  custom?: boolean;
  native?: string;
  imageUrl?: string;
}
export interface LocalHashtagSuggestion {
  type: 'hashtag';
  id?: string;
  name: string;
}
export interface HashtagSuggestion {
  type: 'hashtag';
  id: string;
  name: string;
  totalUses: number;
}

export interface AlphabetSuggestion {
  type: 'alphabet';
  id: string;
  item: string;
}

export type Suggestion =
  | AccountSuggestion
  | EmojiSuggestion
  | LocalHashtagSuggestion
  | HashtagSuggestion
  | AlphabetSuggestion;

export type AutosuggestSourceElements = HTMLInputElement | HTMLTextAreaElement;

export type Source =
  | React.RefObject<AutosuggestSourceElements | null>
  | AutosuggestSourceElements
  | null;
