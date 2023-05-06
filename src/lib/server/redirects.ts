const redirectTo = "redirectTo"

export function redirectToLogin(
	url: URL,
	message: string = 'Please sign in to access this page'
) {
	const path = url.pathname + url.search;
	return `/login?${redirectTo}=${path}&message=${message}`;
}

export function redirectFromLogin(url: URL) {
	const path = url.searchParams.get(redirectTo);
    if (path) 
        return `/${path.slice(1)}`
    else 
        return '/'
}