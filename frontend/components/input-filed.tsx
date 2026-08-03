'use client';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from '@mui/material';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type Option = {
  label: string;
  value: string | number;
};

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  type?: 'text' | 'password' | 'email' | 'number' | 'select' | 'checkbox' | 'switch' | 'radio';
  label: string;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  className?: string;
  multiline?: boolean;
  rows?: number;
}

export default function InputField<T extends FieldValues>({
  control,
  name,
  type = 'text',
  label,
  placeholder,
  options = [],
  disabled,
  fullWidth = true,
  size = 'small',
  className,
  multiline,
  rows,
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        switch (type) {
          case 'select':
            return (
              <FormControl fullWidth={fullWidth} error={!!fieldState.error} className={className}>
                <InputLabel>{label}</InputLabel>

                <Select {...field} label={label} value={field.value ?? ''}>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );

          case 'checkbox':
            return (
              <FormControlLabel
                className={className}
                control={<Checkbox checked={Boolean(field.value)} onChange={(event) => field.onChange(event.target.checked)} />}
                label={label}
              />
            );

          case 'switch':
            return (
              <FormControlLabel
                className={className}
                control={<Switch checked={Boolean(field.value)} onChange={(event) => field.onChange(event.target.checked)} />}
                label={label}
              />
            );

          case 'radio':
            return (
              <FormControl className={className} error={!!fieldState.error} disabled={disabled}>
                <FormLabel>{label}</FormLabel>
                <RadioGroup value={field.value ?? ''} onChange={(event) => field.onChange(event.target.value)} row>
                  {options.map((option) => (
                    <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                  ))}
                </RadioGroup>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            );

          case 'password':
            return (
              <FormControl fullWidth={fullWidth} error={!!fieldState.error} disabled={disabled} className={className} variant="outlined">
                <InputLabel htmlFor={`${String(name)}-password`}>{label}</InputLabel>

                <OutlinedInput
                  {...field}
                  inputRef={field.ref}
                  id={`${String(name)}-password`}
                  type={showPassword ? 'text' : 'password'}
                  value={field.value ?? ''}
                  placeholder={placeholder}
                  label={label}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  size={size}
                />

                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            );
          default:
            return (
              <TextField
                {...field}
                type={type}
                label={label}
                value={field.value ?? ''}
                placeholder={placeholder}
                disabled={disabled}
                fullWidth={fullWidth}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                size={size}
                className={className}
                multiline={multiline}
                rows={rows}
              />
            );
        }
      }}
    />
  );
}
