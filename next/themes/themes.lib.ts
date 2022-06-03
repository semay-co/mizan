const colors = {
	background: 'red',
	foreground: 'red'
} as const

export const defaultTheme = {
	colors
}

export const ThemeColors = Object.keys(colors)

export type ThemeColorTypes = keyof typeof colors

export type ColorTypes = typeof defaultTheme.colors[ThemeColorTypes]
