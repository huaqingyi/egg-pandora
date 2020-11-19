import { Service } from 'egg';

/**
 * Test Service
 */
export default class Test extends Service {

    /**
     * sayHi to you
     * @param name - your name
     */
    public async sayHi(name: string) {
        return `hi, ${name}`;
    }

    public async test() {
        return { name: '1', age: '2', id: '1', uid: '2' };
    }
}
