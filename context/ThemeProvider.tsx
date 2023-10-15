'use client';

import React, { useContext, useState, useEffect, createContext } from 'react';

interface ThemeContextType {
	mode: string;
	setMode: (val: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mode, setMode] = useState('');

	const handleThemeChange = () => {
		if (mode === 'dark') {
			setMode('light');
			document.documentElement.classList.add('light');
			document.documentElement.classList.remove('dark');
		} else {
			setMode('dark');
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		}
	};

	useEffect(() => {
		handleThemeChange();
	}, [mode]);

	return (
		<ThemeContext.Provider value={{ mode, setMode }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
}
