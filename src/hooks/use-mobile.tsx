import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useMobileSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    if (!isMobile) {
      setIsOpen(false); 
    }
  }, [isMobile]);

  return {
    isOpen: isMobile ? isOpen : true,
    isMobile,
    open,
    close,
    toggle
  };
}
