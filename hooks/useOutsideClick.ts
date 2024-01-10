import { useEffect, useRef } from 'react';

interface UseOutsideClickProps {
	ref: React.RefObject<HTMLElement>;
	handler: (event: MouseEvent) => void;
}

const useOutsideClick = ({ ref, handler }: UseOutsideClickProps): void => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler(event);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, handler]);
};

export default useOutsideClick;
