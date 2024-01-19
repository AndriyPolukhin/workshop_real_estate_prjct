import crypto from 'crypto';
import { Google, Stripe } from '../../../lib/api';
import { authorize, getCookieValue } from '../../../lib/utils';
const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    // signed: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
};
const logInViaGoogle = async (code, token, db, res) => {
    const { user } = await Google.logIn(code);
    if (!user) {
        throw new Error('Google login error');
    }
    // * Mame/Photo/Email Lists
    const userNamesList = user.names && user.names.length ? user.names : null;
    const userPhotosList = user.photos && user.photos.length ? user.photos : null;
    const userEmailsList = user.emailAddresses && user.emailAddresses.length
        ? user.emailAddresses
        : null;
    // * User Display Name
    const userName = userNamesList ? userNamesList[0].displayName : null;
    // * User Id
    const userId = userNamesList &&
        userNamesList[0].metadata &&
        userNamesList[0].metadata.source
        ? userNamesList[0].metadata.source.id
        : null;
    // * User Avatar
    const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : '';
    // * User Email
    const userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : '';
    if (!userName || !userId || !userAvatar || !userEmail) {
        throw new Error('[App] Google login error');
    }
    const updateRes = await db.users.findOneAndUpdate({ _id: userId }, {
        $set: {
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            token,
        },
    }, { returnDocument: 'after' });
    let viewer = updateRes;
    if (!viewer) {
        const insertResult = await db.users.insertOne({
            _id: userId,
            token,
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            income: 0,
            bookings: [],
            listings: [],
        });
        viewer = await db.users.findOne({ _id: insertResult.insertedId });
    }
    res.cookie('viewer', userId, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60,
    });
    return viewer;
};
const logInViaCookie = async (token, db, req, res) => {
    const viewerCookie = await getCookieValue(req.headers.cookie, 'viewer');
    const updateRes = await db.users.findOneAndUpdate({
        _id: `${viewerCookie}`,
    }, {
        $set: { token },
    }, { returnDocument: 'after' });
    let viewer = updateRes;
    if (!viewer) {
        res.clearCookie('viewer', cookieOptions);
    }
    return viewer;
};
export const viewerResolvers = {
    Query: {
        authUrl: () => {
            try {
                return Google.authUrl;
            }
            catch (error) {
                throw new Error(`Failed to query Google Auth Url: ${error}`);
            }
        },
    },
    Mutation: {
        logIn: async (_root, { input }, { db, req, res }) => {
            try {
                const code = input ? input.code : null;
                const token = crypto.randomBytes(16).toString('hex');
                const viewer = code
                    ? await logInViaGoogle(code, token, db, res)
                    : await logInViaCookie(token, db, req, res);
                if (!viewer) {
                    return {
                        _id: null,
                        token: null,
                        avatar: null,
                        walletId: false,
                        didRequest: true,
                    };
                }
                return {
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    walletId: viewer.walletId || false,
                    didRequest: true,
                };
            }
            catch (error) {
                console.info('resolver.Viewer: Mutation.logIn : triggered error');
            }
        },
        logOut: (_root, _args, { res }) => {
            try {
                res.clearCookie('viewer', cookieOptions);
                return { didRequest: true };
            }
            catch (error) {
                console.error('Error during logOut Mutation:', error);
                throw new Error(`Failed to log out: ${error}`);
            }
        },
        connectStripe: async (_root, { input }, { db, req }) => {
            try {
                const { code } = input;
                let viewer = await authorize(db, req);
                if (!viewer) {
                    throw new Error('viewer cannot be found');
                }
                const wallet = await Stripe.connect(code);
                if (!wallet) {
                    throw new Error('stripe grant error');
                }
                const updateRes = await db.users.findOneAndUpdate({
                    _id: viewer._id,
                }, {
                    $set: { walletId: wallet.stripe_user_id },
                }, { returnDocument: 'after' });
                if (!updateRes) {
                    throw new Error('viewer could not be updated');
                }
                viewer = { ...updateRes };
                return {
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    walletId: viewer.walletId,
                    didRequest: true,
                };
            }
            catch (error) {
                throw new Error(`Failed to connect with Stripe: ${error}`);
            }
        },
        disconnectStripe: async (_root, _args, { db, req }) => {
            try {
                let viewer = await authorize(db, req);
                if (!viewer) {
                    throw new Error('viewer cannot be found');
                }
                const updateRes = await db.users.findOneAndUpdate({ _id: viewer._id }, { $set: { walletId: undefined } }, { returnDocument: 'after' });
                if (!updateRes) {
                    throw new Error('viewer could not be updated');
                }
                viewer = { ...updateRes };
                return {
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    walletId: viewer.walletId,
                    didRequest: true,
                };
            }
            catch (error) {
                throw new Error(`failed to disconnect with Stripe: ${error}`);
            }
        },
    },
    Viewer: {
        id: (viewer) => {
            return viewer._id;
        },
        hasWallet: (viewer) => {
            return viewer.walletId ? true : undefined;
        },
    },
};
