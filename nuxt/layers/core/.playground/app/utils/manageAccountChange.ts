export function manageAccountChange (newAccount: any, oldAccount: any) {
  console.log('account changed no abort')
  console.log('new: ', newAccount, 'old: ', oldAccount)
  return true
}
