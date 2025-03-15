/**
 * Forgot password form - just has the email and button to send reset password link
 */

import { forgotPasswordEmail } from '@features/user/userSlice';
import { TextInput, Button, Group } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';

const ForgotPassword = () => {
  const { isLoading } = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    mode: 'uncontrolled', // more performant - https://mantine.dev/form/uncontrolled/
    validateInputOnChange: true,
    initialValues: { email: '' },
    validate: {
      email: isEmail('Invalid email')
    }
  });

  const cancelButton = () => {
    navigate(CRoutes.login);
  };

  const submitButton = () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    const { email } = form.getValues();
    dispatch(forgotPasswordEmail(email));
  };

  return (
    <>
      <h2>Forgot Password</h2>
      <form>
        <TextInput
          withAsterisk
          required
          label="Email"
          type="email"
          placeholder="your@email.com"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
      </form>
      <Group justify="space-between" flex="row" mt="md" grow>
        <Button type="button" variant="white" onClick={cancelButton} mt="md" radius="md">
          Cancel
        </Button>
        <Button type="button" onClick={submitButton} mt="md" radius="md" loading={isLoading}>
          Submit
        </Button>
      </Group>
    </>
  );
};

export default ForgotPassword;
