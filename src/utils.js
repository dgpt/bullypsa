function existy(x) { return x != null; }
function truthy(x) { return (x !== false) && existy(x); }
function fail(error) {
    throw new Error(error);
}
