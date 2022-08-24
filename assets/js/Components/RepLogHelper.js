class Helper {
    constructor(repLogs) {
        this.repLogs = repLogs;
    }

    calculTotalWeightAndReps(repLogs) {
        let total = {weight: 0, reps: 0};
        for (let {reps, totalWeightLifted} of repLogs) {
            total.reps += reps
            total.weight += totalWeightLifted
        }
        return total;
    }

    getTotalWeightAndRepsString() {
        let totalObject = this.calculTotalWeightAndReps(this.repLogs);

        for (let [key, value] of Object.entries(totalObject)) {
            totalObject[key] = value.toString()
        }
        return totalObject;
    }
}

export default Helper;