// src/components/auth/GuardedButton.tsx
import * as React from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { useAuthContext } from 'src/auth/hooks';

type GuardedButtonProps = {
  onAuthed: () => void;
  children: React.ReactElement; // e.g., <Button />
};

export function GuardedButton({ onAuthed, children }: GuardedButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authenticated, loading } = useAuthContext();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    if (!authenticated) {
      const { method } = CONFIG.auth;
      const signInPath = { firebase: paths.auth.firebase.signIn }[method];

      // Take the current URL's existing query, add our action flag
      const current = new URLSearchParams(searchParams.toString());
      current.set('open', 'tickets');

      // Put that into returnTo so post-login redirect lands here with the flag
      const params = new URLSearchParams();
      params.set('returnTo', `${pathname}?${current.toString()}`);

      router.push(`${signInPath}?${params.toString()}`);
      return;
    }

    onAuthed();
  };

  return React.cloneElement(children, { onClick: handleClick });
}
