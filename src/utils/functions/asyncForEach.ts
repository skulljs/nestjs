// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Array<T> {
    asyncForEach(callback): Promise<any>;
  }
}

if (!Array.prototype.asyncForEach) {
  Array.prototype.asyncForEach = async function <T>(this: T[], callback): Promise<any> {
    for (let index = 0; index < this.length; index++) {
      await callback(this[index], index, this);
    }
  };
}

export default {};
