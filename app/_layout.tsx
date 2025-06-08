import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </Provider>
  );
}