class EventHandler {
  
  private eventToCallbackMap: any;

  constructor(eventNames: { [s: string]: string }) {
    this.eventToCallbackMap = {};
    this.initializeEmtpyArrays(eventNames);
  }

  public on(eventName: string, callback: Function) : void{

    this.eventToCallbackMap[eventName].push(callback);
  }

  public call_callbacks(eventName: string, ...args: any) : void{
    for (const callback of this.eventToCallbackMap[eventName]) {
      callback(...args);
    }
  }

  private initializeEmtpyArrays(e: { [s: string]: string }) {
    for (const enumMember in e) {
      this.eventToCallbackMap[e[enumMember]] = [];   
    }
  }
}

export default EventHandler;