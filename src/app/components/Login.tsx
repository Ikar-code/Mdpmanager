import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';

export function Login() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    // Mock login - dans une vraie app, vous auriez une authentification réelle
    navigate('/dashboard');
  };

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    // Mock registration
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Lock sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight={600}>
              SecureVault
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestionnaire de mots de passe sécurisé
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(_, newValue) => {
              setTabValue(newValue);
              setError('');
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Connexion" />
            <Tab label="Inscription" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Mot de passe principal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {tabValue === 1 && (
              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={tabValue === 0 ? handleLogin : handleRegister}
              sx={{ mt: 2, py: 1.5 }}
            >
              {tabValue === 0 ? 'Se connecter' : "S'inscrire"}
            </Button>
          </Box>

          {tabValue === 0 && (
            <Typography
              variant="body2"
              color="primary"
              sx={{ mt: 2, textAlign: 'center', cursor: 'pointer' }}
            >
              Mot de passe oublié ?
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
