import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource-variable/open-sans';
import theme from './theme';

import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
