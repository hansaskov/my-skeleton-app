import { POSTMARK_CLIENT_SECRET } from '$env/static/private';
import postmark from 'postmark';

export const postmarkClient = new postmark.ServerClient(POSTMARK_CLIENT_SECRET);
