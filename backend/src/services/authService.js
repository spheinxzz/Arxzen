

export async function getCurrentAccounts() {
  const data = await getSession();

  if (!data.user) {
    return [];
  }

  return [data.user];
}
