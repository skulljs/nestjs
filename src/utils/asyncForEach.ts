Array.prototype.asyncForEach = async function <T>(this: T[], callback: (value: T, index: number, array: T[]) => Promise<void>) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[index], index, this);
  }
};
