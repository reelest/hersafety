class ComputeNode extends Item {
    maxAttempts = 5
    constructor(ref, model, parentNode) {
        super(ref, false, model);
        this.parentNode = parentNode;
    }
    async invalidate(txn) {
        if(!txn){
            throw new Error("Missing Transaction parameter");
        }
        await this.set({invalid: true}, txn);
        if(this.parentNode)
            await this.parentNode.invalidate(txn);
    }
    compute(txn) {
        //ABSTRACT METHOD
    }
    async get(txn, postWrite, attempts=0) {
        let writes;
        if (!txn)
            return await runTransaction(firestore, async (txn) =>{
                attempts++;
                return this.get(txn, postWrite, retries);
            }
            );
        if (!postWrite) {
            writes = [];
            postWrite = (cb) => writes.push(cb);
        }
        let m = txn.get(this._ref);
        if (m.exists()) {
            let data = m.data();
            if(attempts > this.maxAttempts) return data;
        } else {
            let data = this.compute(txn, postWrite);
            postWrite(() => txn.set(this._ref, data));
            if (writes) writes.forEach((cb) => cb());
        }wts9
    }
}
