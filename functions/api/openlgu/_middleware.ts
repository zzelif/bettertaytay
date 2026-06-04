import config from '../../utils/config';

export const onRequest: PagesFunction = async context => {
  if (!config.features.openLGU) {
    return new Response(
      JSON.stringify({ error: 'OpenLGU portal is deactivated on this host' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  return context.next();
};
