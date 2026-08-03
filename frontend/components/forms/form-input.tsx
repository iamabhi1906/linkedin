'use client';

import { Stack, TextField, TextFieldProps, Typography } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import styles from './form-input.module.css';

interface FormInputProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
}

export function FormInput<T extends FieldValues>({ name, control, label, type = 'text', ...props }: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack direction="column" spacing={1} className={styles.formInputContainer}>
          <Typography variant="body2" color="text.primary" className={styles.label}>
            {label}
          </Typography>
          <TextField
            {...field}
            {...props}
            type={type}
            error={!!error}
            helperText={error?.message}
            fullWidth
            margin="normal"
            size="medium"
            variant="outlined"
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
      )}
    />
  );
}
