/**
 * Form that picks up the email and token and query params and then has form inputs to reset the PW
 */
import { resetPasswordEmail } from '@features/user/userSlice';
import { Button, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '@app/store';

const ResetPassword = () => {
  const [visible, { toggle }] = useDisclosure(false);
  const { isLoading } = useSelector((store: RootState) => store.user);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const dispatch = useDispatch();

  const form = useForm({
    mode: 'uncontrolled', // more performant - https://mantine.dev/form/uncontrolled/
    validateInputOnChange: true,
    initialValues: { email, password: '', confirmPassword: '' },
    validate: {
      password: hasLength({ min: 8 }, 'Password must have min of 8 characters'),
      confirmPassword: (value, values) => (value !== values.password ? 'Passwords did not match' : null)
    }
  });

  const submitForm = (values: typeof form.values) => {
    form.validate();
    console.log('form submitted', form.isValid(), values);

    if (!form.isValid()) {
      return;
    }

    const { password } = form.getValues();
    dispatch(resetPasswordEmail({ email, token, password }));
  };

  return (
    <>
      <h2>Reset Password</h2>
      <form onSubmit={form.onSubmit(submitForm)}>
        <Stack>
          <TextInput
            label="Email"
            type="email"
            disabled
            placeholder="your@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            withAsterisk
            visible={visible}
            onVisibilityChange={toggle}
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Confirm password"
            visible={visible}
            withAsterisk
            required
            onVisibilityChange={toggle}
            key={form.key('confirmPassword')}
            {...form.getInputProps('confirmPassword')}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button type="submit" fullWidth mt="md" radius="md" loading={isLoading}>
            Submit
          </Button>
        </Group>
      </form>
    </>
  );
};

export default ResetPassword;
