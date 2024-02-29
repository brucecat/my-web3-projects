class Storage {
  setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val || ""));
  }
  getItem(key) {
    let val;
    try {
      val = JSON.parse(localStorage.getItem(key));
    } catch {
      val = null;
    }
    return val;
  }
}
export default new Storage();