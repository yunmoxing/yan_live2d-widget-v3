import showMessage from './message.js';

class Model {
  constructor(config) {
    const { cdnPath, switchType } = config;

    this.cdnPath = cdnPath;
    this.isOrderSwitch = switchType === 'order';
    this.modelList = null;
  }

  getStoredNumber(key, fallback = 0) {
    const value = Number(localStorage.getItem(key));

    return Number.isFinite(value) ? value : fallback;
  }

  async ensureModelList() {
    if (!this.modelList) {
      await this.loadModelList();
    }
  }

  /**
   * 加载模型列表
   * @returns {Promise<void>}
   */
  async loadModelList() {
    const response = await fetch(`${this.cdnPath}model_list.json`);
    this.modelList = await response.json();
  }

  /**
   * 加载模型
   * @param modelId 模型id
   * @param modelTexturesId 模型皮肤id
   * @param message 消息
   * @returns {Promise<void>}
   */
  async loadModel(modelId, modelTexturesId, message) {
    const modelIndex = Number(modelId);
    const textureIndex = Number(modelTexturesId);

    localStorage.setItem('modelId', String(modelIndex));
    localStorage.setItem('modelTexturesId', String(textureIndex));

    await this.ensureModelList();
    showMessage(message, 4000, 10);

    const target = this.modelList.models[modelIndex]?.[textureIndex];

    if (target === undefined) {
      if (modelIndex === 0 && textureIndex === 0) {
        return;
      }

      await this.loadModel(0, 0, this.modelList.messages[0][0]);
      return;
    }

    window.live2d.loadModel(`${this.cdnPath}model/${target}/`);
  }

  /**
   * 切换皮肤（同一组模型）
   * @returns {Promise<void>}
   */
  async switchTextures() {
    const modelId = this.getStoredNumber('modelId');
    let modelTexturesId = this.getStoredNumber('modelTexturesId');

    await this.ensureModelList();

    const textureLength = this.modelList.models[modelId].length;

    if (this.isOrderSwitch) {
      modelTexturesId = (modelTexturesId + 1) % textureLength;
    } else {
      let randomTexturesId;

      do {
        randomTexturesId = Math.floor(Math.random() * textureLength);
      } while (randomTexturesId === modelTexturesId && textureLength > 1);

      modelTexturesId = randomTexturesId;
    }

    await this.loadModel(
      modelId,
      modelTexturesId,
      this.modelList.messages[modelId][modelTexturesId]
    );
  }

  /**
   * 切换模型
   * @returns {Promise<void>}
   */
  async switchModel() {
    const modelId = this.getStoredNumber('modelId');

    await this.ensureModelList();

    const nextModelId =
      modelId + 1 >= this.modelList.models.length ? 0 : modelId + 1;

    await this.loadModel(
      nextModelId,
      0,
      this.modelList.messages[nextModelId][0]
    );
  }
}

export default Model;
