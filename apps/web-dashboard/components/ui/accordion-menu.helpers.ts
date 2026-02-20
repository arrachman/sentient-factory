import * as React from 'react';

export interface AccordionMenuClassNames {
  root?: string;
  group?: string;
  label?: string;
  separator?: string;
  item?: string;
  sub?: string;
  subTrigger?: string;
  subContent?: string;
  subWrapper?: string;
  indicator?: string;
}

export interface AccordionMenuContextValue {
  matchPath: (href: string) => boolean;
  selectedValue: string | undefined;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  classNames?: AccordionMenuClassNames;
  nestedStates: Record<string, string | string[]>;
  setNestedStates: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>;
  onItemClick?: (value: string, event: React.MouseEvent) => void;
}

export interface AccordionMenuProps {
  selectedValue?: string;
  matchPath?: (href: string) => boolean;
  classNames?: AccordionMenuClassNames;
  onItemClick?: (value: string, event: React.MouseEvent) => void;
}

export function createInitialNestedStates({
  children,
  selectedValue,
  matchPath,
  rootType,
}: {
  children: React.ReactNode;
  selectedValue?: string;
  matchPath: (href: string) => boolean;
  rootType?: 'single' | 'multiple';
}) {
  const getActiveChain = (nodes: React.ReactNode, chain: string[] = []): string[] => {
    let result: string[] = [];
    React.Children.forEach(nodes, (node) => {
      if (React.isValidElement(node)) {
        const { value, children: nodeChildren } = node.props as {
          value?: string;
          children?: React.ReactNode;
        };
        const newChain = value ? [...chain, value] : chain;
        if (value && (value === selectedValue || matchPath(value))) {
          result = newChain;
        } else if (nodeChildren) {
          const childChain = getActiveChain(nodeChildren, newChain);
          if (childChain.length > 0) {
            result = childChain;
          }
        }
      }
    });
    return result;
  };

  const chain = getActiveChain(children);
  const trimmedChain = chain.length > 1 ? chain.slice(0, chain.length - 1) : chain;
  const mapping: Record<string, string | string[]> = {};
  if (trimmedChain.length === 0) {
    return mapping;
  }

  if (rootType === 'multiple') {
    mapping.root = trimmedChain;
    return mapping;
  }

  mapping.root = trimmedChain[0];
  for (let i = 0; i < trimmedChain.length - 1; i++) {
    mapping[trimmedChain[i]] = trimmedChain[i + 1];
  }
  return mapping;
}
