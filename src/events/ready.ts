export const name = 'ready';
export const once = true;

export function execute(sentry: { user: { tag: any } }) {
    console.log(`${sentry.user.tag} is online.`);
}
