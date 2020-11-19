import { GFile, Task, TSC, Gulp } from 'gyi';
import { join } from 'path';

@GFile
export class GulpFile {

    @Task({ description: 'build 任务 ...', })
    public async build(tsc: TSC) {
        console.log('build');
        tsc.runtime(join(__dirname, 'src/**/*.ts'), __dirname);
    }
}