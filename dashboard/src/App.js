import React from 'react';
import Layout from './components/Layout';
import ThemeProvider from './providers/ThemeProvider';
import RouteProvider from './providers/RouteProvider';

function App() {
  return (
    <ThemeProvider>
      <RouteProvider>
        <Layout />
      </RouteProvider>
    </ThemeProvider>
  );
}

export default App;
