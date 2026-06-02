import * as React from 'react';
import { SearchSelectColumn, SearchSelectOption } from './search-select-types';

export interface SearchSelectState {
  // Modal state
  open: boolean;
  query: string;
  options: SearchSelectOption[];
  loading: boolean;
  focusedIdx: number;
  tableActive: boolean;
  page: number;
  total: number;
  localSelected: Set<string>;
  localSingle: string;
  localSingleLabel: string;
  displayLabel: string;
  // Single inline-search state
  inputText: string;
  inputFocused: boolean;
  dropdownOpen: boolean;
  dropdownOptions: SearchSelectOption[];
  dropdownLoading: boolean;
  // Computed
  columns: SearchSelectColumn[];
  totalPages: number;
  displayOptions: SearchSelectOption[];
  colSpan: number;
  confirmCount: number;
  triggerDisplay: string;
  allChecked: boolean;
  someChecked: boolean;
  isMulti: boolean;
  resolvedTitle: string;
  // Refs
  searchRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLInputElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export interface SearchSelectHandlers {
  openModal: (initialQuery?: string) => void;
  closeModal: (refocusTrigger?: boolean) => void;
  handleTriggerFocus: () => void;
  handleSingleFocus: () => void;
  handleSingleBlur: (e: React.FocusEvent) => void;
  handleSingleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIconMouseDown: (e: React.MouseEvent) => void;
  handleSingleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  selectFromDropdown: (opt: SearchSelectOption) => void;
  selectSingle: (opt: SearchSelectOption, idx?: number) => void;
  confirmRow: (opt: SearchSelectOption) => void;
  toggleMulti: (val: string) => void;
  confirm: () => void;
  toggleAll: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
