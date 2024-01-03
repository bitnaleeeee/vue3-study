import { getRandomString } from '../Functions'

type TaskInput = {
  name: string;
  description: string;
  action: () => Promise<any>;
};

type TaskType = {
  id : string
} & TaskInput


async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(()=> {
            resolve(true);
        }, ms);
    });
}
// 싱글 스레드 형태로 동작을 의도
export namespace Task {
  const Tasks: TaskType[] = []
  const Interval: number = 10;
  var Processing : boolean = false
  

  export const getList = () => {
    return Tasks;
  }


  export const add = (input : TaskInput) => {
    const newTask: TaskType = {
      id: getRandomString(10, false),
      name: input.name,
      description: input.description,
      action: () => {
        return new Promise((resolve) => {
          input.action().finally(() => {
            // Before Task End
            resolve(null);
          });
        });
      },
    };
    
    
    Tasks.push(newTask);
    if (!Processing) {
      execute();
    }
  }

  const execute = async () => {
    Processing = true;
    if ( Tasks.length > 0) {
      var task = Tasks.shift();
      if (task) {
        await task.action();
      }
      await sleep(Interval);
      await execute();
    } else {
      Processing = false;
    }
  }
};
