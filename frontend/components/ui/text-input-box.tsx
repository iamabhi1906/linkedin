import { Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import styles from './text-input-box.module.css';

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
}

export default function TextInputBox<T extends FieldValues>({ name, control, label }: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <Stack spacing={0.5}>
            <Typography gutterBottom variant="body2">
              {label}
            </Typography>
            <TextField
              {...field}
              variant="outlined"
              value={field.value ?? ''}
              fullWidth
              size="small"
              error={!!fieldState.error}
              className={styles.inputBox}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'text.primary',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                },
                m: 0,
              }}
            />
          </Stack>
          {fieldState.error && (
            <Typography variant="caption" color="error" className={styles.errorMessage}>
              {fieldState.error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
}
