export const fullName = data =>
  `${data?.firstName || data?.name || ''} ${data?.lastName ||
    data?.surname ||
    ''}`;
