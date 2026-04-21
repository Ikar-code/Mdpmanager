import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import { ArrowBack, Security, Notifications, Palette, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    autoLock: true,
    biometric: false,
    darkMode: false,
    language: 'fr',
    autoLockTime: '5',
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSave = () => {
    // Ici vous ajouteriez la logique pour sauvegarder les paramètres
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError('Veuillez remplir tous les champs');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwords.new.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Ici vous ajouteriez la logique pour changer le mot de passe
    setPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordChange(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordSuccess(false);
    }, 2000);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight={600}>
            Paramètres
          </Typography>
        </Box>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Paramètres enregistrés avec succès !
          </Alert>
        )}

        {/* Sécurité */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Security color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Sécurité
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoLock}
                    onChange={(e) => setSettings({ ...settings, autoLock: e.target.checked })}
                  />
                }
                label="Verrouillage automatique"
              />

              {settings.autoLock && (
                <FormControl fullWidth sx={{ ml: 4 }}>
                  <InputLabel>Délai de verrouillage</InputLabel>
                  <Select
                    value={settings.autoLockTime}
                    label="Délai de verrouillage"
                    onChange={(e) => setSettings({ ...settings, autoLockTime: e.target.value })}
                  >
                    <MenuItem value="1">1 minute</MenuItem>
                    <MenuItem value="5">5 minutes</MenuItem>
                    <MenuItem value="10">10 minutes</MenuItem>
                    <MenuItem value="30">30 minutes</MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.biometric}
                    onChange={(e) => setSettings({ ...settings, biometric: e.target.checked })}
                  />
                }
                label="Authentification biométrique"
              />

              <Divider sx={{ my: 2 }} />

              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                fullWidth
              >
                Changer le mot de passe principal
              </Button>

              {showPasswordChange && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {passwordError && (
                    <Alert severity="error" onClose={() => setPasswordError('')}>
                      {passwordError}
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert severity="success">
                      Mot de passe changé avec succès !
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Mot de passe actuel"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => togglePasswordVisibility('current')} edge="end">
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Nouveau mot de passe"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => togglePasswordVisibility('new')} edge="end">
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirmer le nouveau mot de passe"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => togglePasswordVisibility('confirm')} edge="end">
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    onClick={handlePasswordChange}
                    disabled={passwordSuccess}
                    fullWidth
                  >
                    Changer le mot de passe
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Notifications color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Notifications
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  />
                }
                label="Activer les notifications"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Palette color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Apparence
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                  />
                }
                label="Mode sombre"
              />

              <FormControl fullWidth>
                <InputLabel>Langue</InputLabel>
                <Select
                  value={settings.language}
                  label="Langue"
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                >
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          fullWidth
        >
          Enregistrer les modifications
        </Button>
      </Box>
    </Box>
  );
}
