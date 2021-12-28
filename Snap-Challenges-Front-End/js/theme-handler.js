// REACT IMPORTS
import { Appearance  } from 'react-native'

export const colorScheme = Appearance.getColorScheme();

export let backgroundColor = '#fff'
export let textColor = '#000'
export let altColor1 = '#000'
export let altColor2 = '#000'
export let statusBarTheme = ""

if (colorScheme === 'dark') {
    backgroundColor = '#1E1E1E'
    textColor = '#FFFFFF'
    altColor1 = '#9500FF'
    altColor2 = '#AE24FF'
    statusBarTheme = "light"
} 
else if (colorScheme === 'light') {
    backgroundColor = '#FFFFFF'
    textColor = '#1E1E1E'
    altColor1 = '#9500FF'
    altColor2 = '#AE24FF'
    statusBarTheme = "dark"
}