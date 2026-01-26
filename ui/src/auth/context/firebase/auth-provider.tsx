import {onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, onSnapshot} from 'firebase/firestore';
import {useCallback, useEffect, useMemo, useRef} from 'react';

import {AuthContext} from '../auth-context';

import type {AuthState} from '../../types';
import {useSetState} from "../../../hooks/use-set-state.ts";
import {AUTH, FIRESTORE} from "../../../lib/firebase.ts";
import axios from '../../../utils/axios.ts';
// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({children}: Props) {
    const {state, setState} = useSetState<AuthState>({
        user: null,
        loading: true,
    });
    const superAdminUnsubRef = useRef<undefined | (() => void)>(undefined);
    const {state: superAdminRole, setState: setSuperAdminRole} = useSetState<{
        role: number | null;
        loading: boolean
    }>({role: null, loading: true});

    const checkUserSession = useCallback(async () => {
        try {
            onAuthStateChanged(AUTH, async (user: AuthState['user']) => {
                // if (user && user.emailVerified) {
                if (user) {
                    /*
                     * (1) If skip emailVerified
                     * Remove the condition (if/else) : user.emailVerified
                     */
                    const userProfile = doc(FIRESTORE, 'users', user.uid);

                    const docSnap = await getDoc(userProfile);

                    const profileData = docSnap.data();

                    // Require custom claim userId before proceeding
                    try {
                        const waitForUserIdClaim = async (usr: AuthState['user']) => {
                            const deadline = Date.now() + 10000; // 10s max
                            const poll = async (): Promise<string | undefined> => {
                                if (!usr) return undefined;
                                const token = await usr.getIdTokenResult(true);
                                const uid = (token?.claims as any)?.userId as string | undefined;
                                if (uid) return uid;
                                if (Date.now() > deadline) return undefined;
                                await new Promise((res) => setTimeout(res, 600));
                                return poll();
                            };
                            return poll();
                        };

                        const token = await user.getIdTokenResult(true);
                        const claims = token?.claims as any;
                        let customUserId = claims?.userId as string | undefined;

                        if (!customUserId) {
                            customUserId = await waitForUserIdClaim(user);
                        }

                        if (!customUserId) {
                            // If missing, treat as unauthenticated for now
                            setState({user: null, loading: false});
                            delete axios.defaults.headers.common.Authorization;
                            if (superAdminUnsubRef.current) {
                                superAdminUnsubRef.current();
                                superAdminUnsubRef.current = undefined;
                            }
                            setSuperAdminRole({role: null, loading: false});
                            return;
                        }

                        const {accessToken} = user;
                        setState({user: {...user, ...profileData}, loading: false});
                        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

                        // Subscribe to superAdmins by claims.userId (custom user id)
                        try {
                            // Clean previous subscription
                            if (superAdminUnsubRef.current) {
                                superAdminUnsubRef.current();
                                superAdminUnsubRef.current = undefined;
                            }
                            setSuperAdminRole({role: null, loading: true});
                            const ref = doc(FIRESTORE, 'superAdmins', String(customUserId));
                            const unsub = onSnapshot(ref, (snap) => {
                                if (!snap.exists()) setSuperAdminRole({role: null, loading: false});
                                else {
                                    const r = Number((snap.data() as any)?.role);
                                    setSuperAdminRole({role: Number.isFinite(r) ? r : null, loading: false});
                                }
                            }, () => setSuperAdminRole({role: null, loading: false}));
                            superAdminUnsubRef.current = unsub;
                        } catch {
                            setSuperAdminRole({role: null, loading: false});
                        }
                    } catch {
                        setState({user: null, loading: false});
                        delete axios.defaults.headers.common.Authorization;
                        if (superAdminUnsubRef.current) {
                            superAdminUnsubRef.current();
                            superAdminUnsubRef.current = undefined;
                        }
                        setSuperAdminRole({role: null, loading: false});
                    }
                } else {
                    setState({user: null, loading: false});
                    delete axios.defaults.headers.common.Authorization;
                    if (superAdminUnsubRef.current) {
                        superAdminUnsubRef.current();
                        superAdminUnsubRef.current = undefined;
                    }
                    setSuperAdminRole({role: null, loading: false});
                }
            });
        } catch (error) {
            console.error(error);
            setState({user: null, loading: false});
            if (superAdminUnsubRef.current) {
                superAdminUnsubRef.current();
                superAdminUnsubRef.current = undefined;
            }
            setSuperAdminRole({role: null, loading: false});
        }
    }, [setState, setSuperAdminRole, superAdminUnsubRef]);

    useEffect(() => {
        checkUserSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ----------------------------------------------------------------------

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue = useMemo(
        () => ({
            user: state.user
                ? {
                    ...state.user,
                    id: state.user?.uid,
                    accessToken: state.user?.accessToken,
                    displayName: state.user?.displayName,
                    photoURL: state.user?.photoURL,
                    role: state.user?.role ?? 'admin',
                }
                : null,
            checkUserSession,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
            superAdminRole: superAdminRole.role,
            superAdminLoading: superAdminRole.loading,
        }),
        [checkUserSession, state.user, status, superAdminRole]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
