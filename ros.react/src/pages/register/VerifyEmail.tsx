import { verifyUserEmailAccount } from '@features/user/userSlice';
import { Button } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from 'src/store';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { user, isLoading, errorMessage } = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  console.log('start of verify email', email);

  const verifyEmail = () => {
    dispatch(verifyUserEmailAccount({ email, token }));
  };

  return (
    <>
      {(() => {
        if (!user && !errorMessage) {
          return (
            <>
              <h1>Verifying email</h1>
              <p>Verify this email? {email}</p>
              <Button type="button" onClick={verifyEmail} fullWidth mt="md" radius="md" loading={isLoading}>
                Verify
              </Button>
            </>
          );
        }

        return (
          <>
            <h1>{errorMessage || !user ? `Oops, something went wrong` : 'Success'}</h1>
            <p>
              {errorMessage || !user ? errorMessage : `Welcome ${user?.user.givenNames} - logging you straight in now`}
            </p>
          </>
        );
      })()}
    </>
  );
};

export default VerifyEmail;
