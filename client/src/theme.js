import { extendTheme } from '@chakra-ui/react';
const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    colors: {
        transparent: 'transparent',
        red: {
            500: '#FF6B6B',
            600: '#FF9C9C',

        },
        orange: {
            200: '#F3A93C',
            // 300: '#F0940B',
            400: '#FFAF38',
            500: '#F0940B',
            600: '#EEA73C',

        },
        green: {
            200: '#6BE996',
            300: '#25C869',
            400: '#1EFA7A',
            500: '#1EDF78',
            600: '#57E899',


        },
        cyan: {
            // 200: '#A0B0FF',
            300: '#39BBF2',
            400: '#606BDB',
            500: '#39BBF2',
            600: '#A0B0FF',
        },
        pink: {
            // 50: '#ff0000',
            // 100: '#00ff00',
            // 200: '#00ff00',
            200: '#F5BAFF',
            300: '#F1A0FF',
            400: '#C180CC',
            500: '#F1A0FF',
            600: '#F7C9FF',
            // 800: '#000000',
            // 900: '#0000ff',
        },
        blue: {
            500: '#1F3398',
            600: '#162159',
            700: '#090F2A',
            800: '#04081E',
        },
        brand: {
            success: "#00ff00",
        }
        // ...
    },
}
);
export default theme;