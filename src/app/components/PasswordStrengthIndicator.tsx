import { Box, LinearProgress, Typography } from '@mui/material';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;

    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

    let label = 'Très faible';
    let color = 'error';

    if (score >= 80) {
      label = 'Très fort';
      color = 'success';
    } else if (score >= 60) {
      label = 'Fort';
      color = 'info';
    } else if (score >= 40) {
      label = 'Moyen';
      color = 'warning';
    } else if (score >= 20) {
      label = 'Faible';
      color = 'warning';
    }

    return { score, label, color };
  };

  if (!password) return null;

  const strength = calculateStrength(password);

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Force du mot de passe
        </Typography>
        <Typography variant="caption" color={`${strength.color}.main`} fontWeight={600}>
          {strength.label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength.score}
        color={strength.color as any}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );
}
