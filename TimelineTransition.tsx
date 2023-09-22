import * as React from 'react'
import {Transition, TransitionStatus} from 'react-transition-group'
import useElementHeight from './useElementHeight'

interface TimelineTransitionProps {
  children: React.ReactNode;
  render: boolean;
  timeout?: number;
  shouldAnimate?: boolean;
}

export function TimelineTransition({
  children,
  render,
  timeout = 300,
}: TimelineTransitionProps) {
  
  const transitionRef = React.useRef<HTMLElement>(null);
  const heightRef = React.useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  
  const elemHeight = useElementHeight(heightRef);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const transition: string = isMounted ? `${timeout}ms ease-in-out` : `none`;

  const defaultStyle: React.CSSProperties = {
    transition: `opacity ${transition}, max-height ${transition}`,
    opacity: 0,
    maxHeight: 0,
    visibility: 'hidden',
    overflow: 'hidden',
  };

  const transitionStyles: Partial<Record<TransitionStatus, React.CSSProperties>> = {
    entering: {
      opacity: 1,
      maxHeight: `${elemHeight}px`,
      transition,
      visibility: 'visible',
    },
    entered: {
      opacity: 1,
      maxHeight: `${elemHeight}px`,
      transition: 'none',
      visibility: 'visible',
    },
    exiting: { opacity: 0, maxHeight: 0, transition, visibility: 'visible' },
    exited: { opacity: 0, maxHeight: 0, transition, visibility: 'hidden' },
  };

  return (
    <Transition nodeRef={transitionRef} timeout={timeout} in={render}>
      {(state) => (
        <div
          ref={transitionRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          <div ref={heightRef}>{children}</div>
        </div>
      )}
    </Transition>
  );
}
