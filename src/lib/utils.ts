export const randomString = (l: number) => {
  const avaliable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomstr = '';

  for (let i=0;i<l;i++) {
    randomstr += avaliable[Math.floor(Math.random() * avaliable.length)]
  }

  return randomstr
}