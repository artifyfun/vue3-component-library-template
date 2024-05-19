import WebSocket from 'ws';

/**
 * `ReconnectWebSocket` constructor.
 *
 * @param {Object} options
 * {
 *  url         websocket链接地址
 *  pingTimeout 未收到消息多少秒之后发送ping请求，默认15000毫秒
    pongTimeout 发送ping之后，未收到消息超时时间，默认10000毫秒
    reconnectTimeout
    pingMsg
 * }
 * @api public
 */

export class ReconnectWebSocket {
  options = {
    url: '',
    protocols: '',
    enableReconnect: true,
    pingTimeout: 15000,
    pongTimeout: 10000,
    reconnectTimeout: 2000,
    pingMsg: 'ping',
    closeMsg: 'close',
    repeatLimit: undefined,
    clientOptions: undefined
  }
  ws = null
  repeat
  lockReconnect = false
  forbidReconnect = false
  pingTimeoutId = 0
  pongTimeoutId = 0

  onclose = () => { }
  onerror = () => { }
  onopen = () => { }
  onmessage = () => { }
  onreconnect = () => { }

  constructor(opions) {
    Object.assign(this.options, opions);
    this.ws = null; // websocket实例
    this.repeat = 0;

    //override hook function
    this.onclose = () => { };
    this.onerror = () => { };
    this.onopen = () => { };
    this.onmessage = () => { };
    this.onreconnect = () => { };

    this.createWebSocket();
  }

  createWebSocket() {
    try {
      if (this.options.protocols) {
        this.ws = new WebSocket(this.options.url, this.options.protocols, this.options.clientOptions);
      }
      else {
        this.ws = new WebSocket(this.options.url, this.options.clientOptions);
      }
      this.initEventHandle();
    } catch (e) {
      this.reconnect();
      throw e;
    }
  }

  initEventHandle() {
    if (!this.ws) return;
    this.ws.onclose = (e) => {
      this.onclose(e);
      this.reconnect();
    };
    this.ws.onerror = (e) => {
      this.onerror(e);
      this.reconnect();
    };
    this.ws.onopen = (e) => {
      this.repeat = 0;
      this.onopen(e);
      //心跳检测重置
      this.heartCheck();
    };
    this.ws.onmessage = (event) => {
      this.onmessage(event);
      // 收到约定的关闭消息，关闭连接
      const closeMsg = typeof this.options.closeMsg === 'function' ? this.options.closeMsg() : this.options.closeMsg || 'close';
      if (event.data === closeMsg) {
        this.close();
      }
      //如果获取到消息，心跳检测重置
      //拿到任何消息都说明当前连接是正常的
      this.heartCheck();
    };
  }

  reconnect() {
    if (!this.options.enableReconnect) return;
    if (this.options.repeatLimit !== undefined && this.options.repeatLimit <= this.repeat) return;//limit repeat the number
    if (this.lockReconnect || this.forbidReconnect) return;
    this.lockReconnect = true;
    this.repeat++;//必须在lockReconnect之后，避免进行无效计数
    this.onreconnect();
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, this.options.reconnectTimeout);
  }

  send(msg) {
    this.ws?.send(msg);
  }

  //心跳检测
  heartCheck() {
    this.heartReset();
    this.heartStart();
  }

  heartStart() {
    if (!this.options.enableReconnect) return;
    if (this.forbidReconnect) return;//不再重连就不再执行心跳
    this.pingTimeoutId = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.ws?.send(typeof this.options.pingMsg === 'function' ? this.options.pingMsg() : this.options.pingMsg || 'ping');
      //如果超过一定时间还没重置，说明后端主动断开了
      this.pongTimeoutId = setTimeout(() => {
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        this.ws?.close();
      }, this.options.pongTimeout);
    }, this.options.pingTimeout);
  }

  heartReset() {
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
  }

  close() {
    //如果手动关闭连接，不再重连
    this.forbidReconnect = true;
    this.heartReset();
    this.ws?.close();
  }
}

export default ReconnectWebSocket;