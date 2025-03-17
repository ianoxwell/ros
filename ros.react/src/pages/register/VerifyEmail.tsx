import { useAppDispatch } from '@app/hooks';
import { RootState } from '@app/store';
import { verifyUserEmailAccount } from '@features/user/userSlice';
import { Button } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { user, isLoading, errorMessage } = useSelector((store: RootState) => store.user);
  const dispatch = useAppDispatch();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const verifyEmail = () => {
    if (email && token) {
      dispatch(verifyUserEmailAccount({ email, token }));
    }
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
