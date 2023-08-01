import iconColors from './icon-colors'

type IconColorsType = typeof iconColors
type IconColorsKeys = keyof IconColorsType

export const getIconColor = (colorString: string) => {
    if (!colorString) {
        return null
    } else if (colorString.includes('--')) {
        return `var(${colorString})`
    } else if (
        colorString.includes('#') ||
        !iconColors[colorString as IconColorsKeys]
    ) {
        return colorString
    }

    return iconColors[colorString as IconColorsKeys]
}
