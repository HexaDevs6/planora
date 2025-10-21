import { useCallback, useEffect, useMemo, useState } from 'react'

// TailwindCSS dark mode setup note:
// We use the "class" strategy. Tailwind applies dark variants when the root
// <html> element has the class `dark`. This simplified hook supports only
// 'light' and 'dark' preferences and keeps the DOM class in sync while
// persisting the selection in localStorage.

const THEME_STORAGE_KEY = 'theme'

function getInitialTheme() {
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY)
		if (stored === 'light' || stored === 'dark') {
			return stored
		}
	} catch {
		// Ignore storage errors (e.g., privacy mode)
	}
	return 'light'
}

function applyThemeClass(preference) {
	const root = document.documentElement
	if (preference === 'dark') {
		root.classList.add('dark')
	} else {
		root.classList.remove('dark')
	}
}

export function useTheme() {
	// Holds the user's selected preference: 'light' | 'dark'
	const [preference, setPreference] = useState(getInitialTheme)

	// Effective theme is the same as preference now
	const effectiveTheme = useMemo(() => preference, [preference])

	// Apply the theme class and persist preference whenever it changes
	useEffect(() => {
		applyThemeClass(preference)
		try {
			localStorage.setItem(THEME_STORAGE_KEY, preference)
		} catch {
			// Ignore storage errors
		}
	}, [preference])

	// Helpers to change preference
	const setLight = useCallback(() => setPreference('light'), [])
	const setDark = useCallback(() => setPreference('dark'), [])

	// Toggle between light and dark
	const cycleTheme = useCallback(() => {
		setPreference(prev => (prev === 'light' ? 'dark' : 'light'))
	}, [])

	return {
		preference,
		effectiveTheme, // 'light' | 'dark' reflecting current appearance
		setLight,
		setDark,
		cycleTheme,
	}
}


