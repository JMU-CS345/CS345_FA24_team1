/*
 * PriorityQueue.js: basic priority queue implementation
 * TODO write tests for PriorityQueue
 */
class PriorityQueue {
    /* Intializes a PriorityQueue with the given initial elements (which will
     * be heapified) and a getPriority function */
    constructor(initial, getPriority) {
        this.arr = Array.from(initial);
        this.getPriority = getPriority;
        this.heapify();
    }

    /* Returns the number of elements inside of this PriorityQueue. */
    size() {
        return this.arr.length;
    }

    /* Adds the given item to this PriorityQueue. */
    add(element) {
        // TODO
        this.arr.push(element);
    }

    /* Returns the next item from this PriorityQueue, without deletion. */
    next() {
        if (this.arr.length == 0)
            return null; // no more elements in queue

        // TODO
        let curminidx = 0, curminval = this.arr[0];
        for (let i=1; i<this.arr.length; i++) {
            let val = this.arr[i];
            if (this.getPriority(curminval) > this.getPriority(val)) {
                curminidx = i;
                curminval = val;
            }
        }
        this.arr.splice(curminidx, 1);
        return curminval;
    }

    /* Removes and returns the next item from this PriorityQueue. */
    peek() {
        return (this.arr.length > 0) ? this.arr[0] : null;
    }
    
    /* Marks the given element as having had its priority updated. */
    updatedPriority(element) {
        // TODO
    }

    /* Returns the index of the given element. */
    indexOf(element) {
        // TODO
    }

    /* Turns the initial array of this PriorityQueue into a proper minheap. */
    heapify() {
        // TODO
    }
}
