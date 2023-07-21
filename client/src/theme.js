import { extendTheme } from '@chakra-ui/react';
const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    colors: {
        transparent: 'transparent',
        orange: {
            200: '#F3A93C',
            300: '#F0940B',
            400: '#FFAF38',
        },
        green: {
            300: '#0AFF68'
        },
        cyan: {
            200: '#A0B0FF',
            300: '#39BBF2',
            400: '#606BDB',

        },
        pink: {
            200: '#F5BAFF',
            300: '#F1A0FF',
            400: '#C180CC',
            500: '#D848F0',
        },
        blue: {
            500: '#1F35A4',
            600: '#1F0970',
            700: '#030E42',
            800: '#04081E',
        },
        // ...
    },
}
);
export default theme;