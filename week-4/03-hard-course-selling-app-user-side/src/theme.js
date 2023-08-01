import { extendTheme } from '@chakra-ui/react';
import '@fontsource-variable/open-sans';

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans Variable', sans-serif`,
    body: `'Open Sans Variable', sans-serif`,
  },
});

export default theme;
