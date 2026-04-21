import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Slider,
  Typography,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Refresh } from '@mui/icons-material';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface AddPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (password: {
    title: string;
    username: string;
    password: string;
    website: string;
    category: string;
    isFavorite: boolean;
  }) => void;
}

export function AddPasswordDialog({ open, onClose, onAdd }: AddPasswordDialogProps) {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('Autre');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Password generator settings
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setError('Veuillez sélectionner au moins un type de caractère');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(generatedPassword);
    setError('');
  };

  const handleSubmit = () => {
    if (!title || !username || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onAdd({
      title,
      username,
      password,
      website,
      category,
      isFavorite,
    });

    // Reset form
    setTitle('');
    setUsername('');
    setPassword('');
    setWebsite('');
    setCategory('Autre');
    setIsFavorite(false);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Ajouter un nouveau mot de passe</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Titre"
            placeholder="Ex: Gmail, Facebook, Netflix..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Nom d'utilisateur / Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Box>
            <TextField
              fullWidth
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Générer un mot de passe">
                      <IconButton onClick={generatePassword} edge="end">
                        <Refresh />
                      </IconButton>
                    </Tooltip>
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
            {password && <PasswordStrengthIndicator password={password} />}
          </Box>

          {/* Password Generator */}
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Générateur de mot de passe
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" gutterBottom>
                Longueur: {passwordLength} caractères
              </Typography>
              <Slider
                value={passwordLength}
                onChange={(_, value) => setPasswordLength(value as number)}
                min={8}
                max={32}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                }
                label="Majuscules (A-Z)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                  />
                }
                label="Minuscules (a-z)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                }
                label="Chiffres (0-9)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                }
                label="Symboles (!@#$...)"
              />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={generatePassword}
              startIcon={<Refresh />}
              sx={{ mt: 1 }}
            >
              Générer
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Site web (optionnel)"
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <TextField
            fullWidth
            select
            label="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="Email">Email</option>
            <option value="Réseaux sociaux">Réseaux sociaux</option>
            <option value="Banque">Banque</option>
            <option value="Travail">Travail</option>
            <option value="Shopping">Shopping</option>
            <option value="Autre">Autre</option>
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
              />
            }
            label="Ajouter aux favoris"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
