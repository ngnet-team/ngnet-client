import { IParsedToken } from "./parsed-token";

export function isAuthorized(role: string | undefined, user: IParsedToken | undefined): boolean {
    if (role === undefined) { return false; }

    const roles = [ 'owner', 'admin', 'member', 'user', 'guest']

    const requiredRole = roles.indexOf(role);
    if (requiredRole === -1) { return false; }

    const userRole = roles.indexOf((user as IParsedToken).role as string);
    if (userRole === -1) { return false; }

    return userRole <= requiredRole;
}