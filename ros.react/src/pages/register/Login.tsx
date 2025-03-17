import { useAppDispatch } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useLoginUserMutation } from '@features/api/apiSlice';
import { registerUser, toggleIsMember } from '@features/user/userSlice';
import { Button, Checkbox, Group, NavLink, TextInput, UnstyledButton } from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useSelector } from 'react-redux';

const initialState = {
  givenNames: '',
  familyName: '',
  email: 'testuser@noemail.com',
  password: 'testPassword',
  termsOfService: false
};

const Login = () => {
  const { isMember } = useSelector((store: RootState) => store.user);
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const submitButton = async () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    const { givenNames, familyName, email, password } = form.getValues();
    console.log('current form', form.getValues(), form.isValid(), form.errors);
    // Note to self the form.errors is usually blank if the form is not touched

    if (isMember) {
      try {
        await loginUser({ email, password }).unwrap();
      } catch (error: unknown) {
        console.log('Looks like a massive mistake happened', error);
        // if (error.hasOwnProperty('message')) {
        //   notifications.show({ message: error.message });
        // }
      }

      return;
    }

    dispatch(registerUser({ givenNames, familyName, email, password, loginProvider: 'ros', photoUrl: [] }));
  };

  const toggleMember = () => {
    dispatch(toggleIsMember());
    // setValues({ ...values, isMember: !values.isMember });
  };

  const form = useForm({
    mode: 'uncontrolled', // more performant - https://mantine.dev/form/uncontrolled/
    validateInputOnChange: true,
    initialValues: initialState,
    validate: {
      givenNames: (name) => (isMember || name.length > 2 ? null : 'Name needs to be longer than 3 characters'),
      familyName: (name) => (isMember || name.length > 1 ? null : 'Family name should be longer than 1 character'),
      email: isEmail('Invalid email'),
      password: isNotEmpty('password required'),
      termsOfService: (tos) => (isMember || !!tos ? null : 'Required for business')
    }
  });

  return (
    <>
      <h2>{isMember ? 'Login' : 'Register'}</h2>
      <form>
        {!isMember && (
          <>
            <TextInput
              withAsterisk
              required
              label="Given names"
              type="name"
              key={form.key('givenNames')}
              {...form.getInputProps('givenNames')}
            />
            <TextInput
              withAsterisk
              required
              label="Family name"
              type="name"
              key={form.key('familyName')}
              {...form.getInputProps('familyName')}
            />
          </>
        )}

        <TextInput
          withAsterisk
          required
          label="Email"
          type="email"
          placeholder="your@email.com"
          autoComplete='email'
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <TextInput
          withAsterisk
          required
          type="password"
          label="Password"
          autoComplete='current-password'
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        {isMember && (
          <section className="forgot-password">
            <span className="forgot-password--text">Forgot Password?</span>
            <NavLink href={CRoutes.forgotPassword} rightSection="Reset" />
          </section>
        )}

        {!isMember && (
          <Checkbox
            mt="md"
            label="I agree to sell my privacy"
            key={form.key('termsOfService')}
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
        )}

        <Group justify="flex-end" mt="md">
          <Button type="button" onClick={submitButton} fullWidth mt="md" radius="md" loading={isLoading}>
            Submit
          </Button>
        </Group>
        <section className="register-login">
          <span>{isMember ? 'Not a member yet?' : 'Already a member?'}</span>
          <UnstyledButton type="button" onClick={toggleMember} className="member-btn">
            {isMember ? 'Register' : 'Login'}
          </UnstyledButton>
        </section>
      </form>
    </>
  );
};

export default Login;
