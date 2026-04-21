import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Wrapper to strip Figma-specific props
function ThemeProvider({ children, theme, ...props }: any) {
  // Only pass 'theme' and 'children' to MuiThemeProvider, ignore all other props
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
